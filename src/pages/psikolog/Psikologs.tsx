import { GridColDef } from '@mui/x-data-grid';
import DataTable from '../../components/dataTable/DataTable';
import './psikologs.scss';
import { useEffect, useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';

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
    field: 'gender',
    type: 'string',
    width: 150,
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
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [editMode, setEditMode] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newPsikolog, setNewPsikolog] = useState({
    nama: '',
    email: '',
    password: '',
    nomor_telepon: '',
    jenis_kelamin: 'P',
    foto: 'default.jpg',
    aktif: '1',
  });

  // Validasi form
  useEffect(() => {
    const newErrors: Record<string, string> = {};

    if (!newPsikolog.nama.match(/^[a-zA-Z ]{3,30}$/)) {
      newErrors.nama = 'Nama harus 3-30 karakter (huruf saja)';
    }

    if (!/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(newPsikolog.email)) {
      newErrors.email = 'Email tidak valid';
    }

    if (!/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/.test(newPsikolog.password)) {
      newErrors.password = 'Password minimal 8 karakter (huruf dan angka)';
    }

    if (!/^08[1-9][0-9]{7,10}$/.test(newPsikolog.nomor_telepon)) {
      newErrors.nomor_telepon = 'Nomor telepon tidak valid';
    }

    setErrors(newErrors);
  }, [newPsikolog]);

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
  const rows =
    data?.data?.map(
      (
        psikolog: {
          is_active: any;
          id: string;
          foto: any;
          nama: string;
          email: any;
          nomor_telepon: any;
          jenis_kelamin: any;
          created_at: string | number | Date;
        },
        index: number
      ) => ({
        id: index + 1,
        originalId: psikolog.id,
        img: psikolog.foto || '/noavatar.png',
        firstName: psikolog.nama.split(' ')[0],
        lastName: psikolog.nama.split(' ')[1] || '',
        email: psikolog.email,
        phone: psikolog.nomor_telepon,
        gender: psikolog.jenis_kelamin,
        createdAt: new Date(psikolog.created_at).toLocaleString(),
        verified: psikolog.is_active,
      })
    ) || [];

  const handleDelete = (id: string) => {
    queryClient.setQueryData(['psikologs'], (old: any) => ({
      ...old,
      data: old.data.filter((p: any) => p.id_user !== id),
    }));
  };

  // pages/psikologs/Psikologs.tsx
  const handleEdit = async (id: string) => {
    setOpen(true); // Buka modal segera
    setEditMode(true);
    setSelectedId(id);

    try {
      const response = await fetch(`https://basic-kaleena-psyconnect-bda9a59b.koyeb.app/api/users/profile/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const result = await response.json();

      if (result.status !== 'success') {
        throw new Error('Gagal mengambil data psikolog');
      }

      // Sesuaikan dengan struktur response API
      const psikologData = result.data;
      setNewPsikolog({
        nama: psikologData.name,
        email: psikologData.email,
        password: '',
        nomor_telepon: psikologData.nomor_telepon || '',
        jenis_kelamin: psikologData.jenis_kelamin || 'P',
        foto: psikologData.foto || 'default.jpg',
        aktif: psikologData.aktif ? '1' : '0',
      });
    } catch (error) {
      console.error('Fetch error:', error);
      toast.error('Gagal memuat data psikolog');
      setOpen(false);
      setEditMode(false);
    }
  };

  const handleSubmit = async () => {
    if (Object.keys(errors).length > 0) return;

    setIsSubmitting(true);
    try {
      const url = editMode ? `https://basic-kaleena-psyconnect-bda9a59b.koyeb.app/api/users/psikologs/${selectedId}` : 'https://basic-kaleena-psyconnect-bda9a59b.koyeb.app/api/auth/register-psychologist';

      const method = editMode ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...newPsikolog,
          // Jika edit mode dan password kosong, hapus field password
          ...(editMode && !newPsikolog.password && { password: undefined }),
        }),
      });

      if (!response.ok) throw new Error(editMode ? 'Gagal mengupdate psikolog' : 'Gagal menambahkan psikolog');

      queryClient.invalidateQueries({ queryKey: ['psikologs'] });
      toast.success(editMode ? 'Berhasil mengupdate psikolog' : 'Berhasil menambahkan psikolog');
      setOpen(false);
      resetForm();
    } catch (error) {
      console.error('Error:', error);
      if (error instanceof Error) {
        toast.error(error.message || 'Terjadi kesalahan');
      } else {
        toast.error('Terjadi kesalahan');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setNewPsikolog({
      nama: '',
      email: '',
      password: '',
      nomor_telepon: '',
      jenis_kelamin: 'P',
      foto: 'default.jpg',
      aktif: '1',
    });
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
      {isLoading ? <div className="loading-indicator">Memuat data...</div> : <DataTable slug="psikologs" columns={columns} rows={rows} onDelete={handleDelete} onEdit={handleEdit} />}

      {open && (
        <div className="modal">
          <div className="modal-content">
            <h2>{editMode ? 'Edit Psikolog' : 'Tambah Psikolog'}</h2>
            {editMode && !newPsikolog.nama && <div className="loading-indicator">Memuat data...</div>}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSubmit();
              }}
            >
              <div className="form-group">
                <label>Nama Lengkap*</label>
                <input type="text" value={newPsikolog.nama} onChange={(e) => setNewPsikolog({ ...newPsikolog, nama: e.target.value })} className={errors.nama ? 'error' : ''} />
                {errors.nama && <span className="error-message">{errors.nama}</span>}
              </div>

              <div className="form-group">
                <label>Email*</label>
                <input type="email" value={newPsikolog.email} onChange={(e) => setNewPsikolog({ ...newPsikolog, email: e.target.value })} className={errors.email ? 'error' : ''} />
                {errors.email && <span className="error-message">{errors.email}</span>}
              </div>

              <div className="form-group">
                <label>Password{!editMode && '*'}</label>
                <input type="password" value={newPsikolog.password} onChange={(e) => setNewPsikolog({ ...newPsikolog, password: e.target.value })} className={errors.password ? 'error' : ''} required={!editMode} />
                {errors.password && <span className="error-message">{errors.password}</span>}
                {editMode && <small className="hint">Kosongkan jika tidak ingin mengubah password</small>}
              </div>

              <div className="form-group">
                <label>Nomor Telepon*</label>
                <input type="tel" value={newPsikolog.nomor_telepon} onChange={(e) => setNewPsikolog({ ...newPsikolog, nomor_telepon: e.target.value })} className={errors.nomor_telepon ? 'error' : ''} />
                {errors.nomor_telepon && <span className="error-message">{errors.nomor_telepon}</span>}
              </div>

              <div className="form-group">
                <label>Jenis Kelamin*</label>
                <select value={newPsikolog.jenis_kelamin} onChange={(e) => setNewPsikolog({ ...newPsikolog, jenis_kelamin: e.target.value })}>
                  <option value="P">Perempuan</option>
                  <option value="L">Laki-laki</option>
                </select>
              </div>

              <div className="form-group">
                <label>Foto Profil</label>
                <input type="text" value={newPsikolog.foto} onChange={(e) => setNewPsikolog({ ...newPsikolog, foto: e.target.value })} placeholder="Masukkan URL gambar" />
              </div>

              <div className="form-group checkbox">
                <label>
                  <input type="checkbox" checked={newPsikolog.aktif === '1'} onChange={(e) => setNewPsikolog({ ...newPsikolog, aktif: e.target.checked ? '1' : '0' })} />
                  Akun Aktif
                </label>
              </div>

              <div className="form-actions">
                <button
                  type="button"
                  onClick={() => {
                    setOpen(false);
                    resetForm();
                  }}
                  className="cancel-btn"
                >
                  Batal
                </button>
                <button type="submit" className="submit-btn" disabled={Object.keys(errors).length > 0 || isSubmitting}>
                  {isSubmitting ? 'Menyimpan...' : 'Simpan'}
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
