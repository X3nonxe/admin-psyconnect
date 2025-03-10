import { GridColDef } from '@mui/x-data-grid';
import DataTable from '../../components/dataTable/DataTable';
import './psikologs.scss';
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';

// Ambil token dari localStorage atau tempat lain
const token = localStorage.getItem('token'); // Atau tempatkan sesuai kebutuhan

// Define columns for the DataTable
const columns: GridColDef[] = [
  { field: 'id', headerName: 'ID', width: 90 },
  {
    field: 'img',
    headerName: 'Avatar',
    width: 100,
    renderCell: (params) => {
      return <img src={params.row.img || '/noavatar.png'} alt="" />;
    },
  },
  {
    field: 'firstName',
    type: 'string',
    headerName: 'First name',
    width: 150,
  },
  {
    field: 'lastName',
    type: 'string',
    headerName: 'Last name',
    width: 150,
  },
  {
    field: 'email',
    type: 'string',
    headerName: 'Email',
    width: 200,
  },
  {
    field: 'phone',
    type: 'string',
    headerName: 'Phone',
    width: 200,
  },
  {
    field: 'createdAt',
    headerName: 'Created At',
    width: 200,
    type: 'string',
  },
  {
    field: 'verified',
    headerName: 'Verified',
    width: 150,
    type: 'boolean',
  },
];

const Psikologs = () => {
  const [open, setOpen] = useState(false);
  const [newPsikolog, setNewPsikolog] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
  });

  // Fetch data using React Query with token authorization
  const { isLoading, data } = useQuery({
    queryKey: ['psikologs'],
    queryFn: () =>
      fetch('https://basic-kaleena-psyconnect-bda9a59b.koyeb.app/api/users/all-psikolog', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`, // Menambahkan token ke dalam header
        },
      }).then((res) => res.json()),
  });

  // Transform the API response to match the columns structure
  const rows = data?.data.map((psikolog: { foto: any; nama: string; email: any; nomor_telepon: any; created_at: string | number | Date }, index: number) => ({
    id: index + 1,
    img: psikolog.foto || '/noavatar.png',
    firstName: psikolog.nama.split(' ')[0],
    lastName: psikolog.nama.split(' ')[1] || '',
    email: psikolog.email,
    phone: psikolog.nomor_telepon,
    createdAt: new Date(psikolog.created_at).toLocaleString(),
    verified: true,
  }));

  const handleSubmit = () => {
    // Handle the form submission logic, e.g., send to API
    console.log(newPsikolog);

    // Close the modal after submitting
    setOpen(false);
  };

  return (
    <div className="psikolog">
      <div className="info">
        <h1>Psikolog</h1>
        <button
          onClick={() => setOpen(true)}
          style={{
            padding: '10px 20px',
            backgroundColor: '#007bff',
            color: '#fff',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            fontSize: '16px',
          }}
        >
          Tambah Psikolog
        </button>
      </div>
      {isLoading ? 'Loading...' : <DataTable slug="psikolog" columns={columns} rows={rows} />}

      {/* Modal Form for Adding Psikolog */}
      {open && (
        <div className="modal">
          <div className="modal-content">
            <h2>Tambah Psikolog</h2>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSubmit();
              }}
            >
              <div className="form-group">
                <label>Nama Lengkap</label>
                <input type="text" value={newPsikolog.firstName} onChange={(e) => setNewPsikolog({ ...newPsikolog, firstName: e.target.value })} required />
              </div>
              <div className="form-group">
                <label>Email</label>
                <input type="email" value={newPsikolog.email} onChange={(e) => setNewPsikolog({ ...newPsikolog, email: e.target.value })} required />
              </div>
              <div className="form-group">
                <label>Phone</label>
                <input type="tel" value={newPsikolog.phone} onChange={(e) => setNewPsikolog({ ...newPsikolog, phone: e.target.value })} required />
              </div>
              <div className="form-actions">
                <button type="button" onClick={() => setOpen(false)} className="cancel-btn">
                  Cancel
                </button>
                <button type="submit" className="submit-btn">
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Psikologs;
