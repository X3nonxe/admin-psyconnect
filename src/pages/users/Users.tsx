import { GridColDef } from '@mui/x-data-grid';
import DataTable from '../../components/dataTable/DataTable';
import './users.scss';
import { useState } from 'react';
import Add from '../../components/add/Add';
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

const Users = () => {
  const [open, setOpen] = useState(false);

  // Fetch data using React Query with token authorization
  const { isLoading, data } = useQuery({
    queryKey: ['users'],
    queryFn: () =>
      fetch('http://localhost:3000/api/users/all-users', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`, // Menambahkan token ke dalam header
        },
      }).then((res) => res.json()),
  });

  // Transform the API response to match the columns structure
  const rows = data?.data.map((users: { foto: any; nama: string; email: any; nomor_telepon: any; created_at: string | number | Date; }, index: number) => ({
    id: index + 1,
    img: users.foto || '/noavatar.png',
    firstName: users.nama.split(' ')[0],
    lastName: users.nama.split(' ')[1] || '',
    email: users.email,
    phone: users.nomor_telepon,
    createdAt: new Date(users.created_at).toLocaleString(),
    verified: true,
  }));

  return (
    <div className="users">
      <div className="info">
        <h1>Klien</h1>
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
          Tambah Klien
        </button>
      </div>
      {isLoading ? 'Loading...' : <DataTable slug="klien" columns={columns} rows={rows} />}
      {open && <Add slug="klien" columns={columns} setOpen={setOpen} />}
    </div>
  );
};

export default Users;
