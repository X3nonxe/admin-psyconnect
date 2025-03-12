import { DataGrid, GridColDef, GridToolbar } from '@mui/x-data-grid';
import './dataTable.scss';
import { toast } from 'react-toastify';

type Props = {
  onEdit: (id: string) => void;
  columns: GridColDef[];
  rows: object[];
  slug: string;
  onDelete: (id: string) => void;
};

const DataTable = (props: Props) => {
  const handleDelete = async (id: string) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus psikolog ini?')) {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`https://basic-kaleena-psyconnect-bda9a59b.koyeb.app/api/users/psikologs/${id}`, {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) throw new Error('Gagal menghapus psikolog');
        console.log('Berhasil menghapus psikolog');
        toast.success('Psikolog berhasil dihapus');
        props.onDelete(id);
      } catch (error) {
        console.error('Delete error:', error);
        toast.error('Gagal menghapus psikolog');
      }
    }
  };

  const actionColumn: GridColDef = {
    field: 'action',
    headerName: 'Aksi',
    width: 200,
    renderCell: (params) => {
      return (
        <div className="action">
          <div className="edit" onClick={() => props.onEdit(params.row.originalId)}>
            <img src="/view.svg" alt="Edit" />
          </div>
          <div className="delete" onClick={() => handleDelete(params.row.originalId)}>
            <img src="/delete.svg" alt="Delete" />
          </div>
        </div>
      );
    },
  };

  return (
    <div className="dataTable">
      <DataGrid
        className="dataGrid"
        rows={props.rows}
        columns={[...props.columns, actionColumn]}
        initialState={{
          pagination: {
            paginationModel: {
              pageSize: 10,
            },
          },
        }}
        slots={{ toolbar: GridToolbar }}
        slotProps={{
          toolbar: {
            showQuickFilter: true,
            quickFilterProps: { debounceMs: 500 },
          },
        }}
        pageSizeOptions={[5, 10, 15]} // Menambah pilihan ukuran halaman
        checkboxSelection
        disableRowSelectionOnClick
        disableColumnFilter
        disableDensitySelector
        disableColumnSelector
      />
    </div>
  );
};

export default DataTable;
