import { useState, useEffect } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { DataGrid, GridColDef, GridRenderCellParams } from '@mui/x-data-grid';
import { toast, ToastContainer } from 'react-toastify';
import './psikologs.scss';
import { ApiResponse, Education, PaginationState, Psychologist, PsychologistFormData } from '@/src/utils/Psikolog';
import React from 'react';

// API Service
const API_BASE_URL = 'https://psy-backend-production.up.railway.app/api/v1';

const fetchPsychologists = async ({ page, limit }: PaginationState): Promise<ApiResponse> => {
  const token = localStorage.getItem('token');
  if (!token) throw new Error('Tidak ada token autentikasi');

  const response = await fetch(`${API_BASE_URL}/psychologists?page=${page}&limit=${limit}`, { headers: { Authorization: `Bearer ${token}` } });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Gagal mengambil data psikolog');
  }

  const responseData = await response.json();

  // Pastikan struktur response valid
  return {
    data: responseData.data || [],
    total: responseData.total || 0,
    page: responseData.page || page,
    limit: responseData.limit || limit,
  };
};

const fetchPsychologistById = async (id: string): Promise<Psychologist> => {
  // Ubah return type
  const token = localStorage.getItem('token');
  if (!token) throw new Error('Tidak ada token autentikasi');

  const response = await fetch(`${API_BASE_URL}/psychologists/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Gagal mengambil data psikolog');
  }

  return await response.json(); // Langsung return data tanpa properti .data
};

const createPsychologist = async (data: PsychologistFormData): Promise<any> => {
  const token = localStorage.getItem('token');
  if (!token) throw new Error('Tidak ada token autentikasi');

  // Pastikan specializations selalu diformat dengan benar sebagai array string
  const formattedData = {
    ...data,
    specializations: Array.isArray(data.specializations)
      ? data.specializations.flatMap((item) =>
          // Jika item adalah string yang berisi koma, pisahkan menjadi item terpisah
          typeof item === 'string' && item.includes(',')
            ? item
                .split(',')
                .map((s) => s.trim())
                .filter(Boolean)
            : item
        )
      : [data.specializations].filter(Boolean),
  };

  const response = await fetch(`${API_BASE_URL}/auth/register/psychologist`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(formattedData),
  });

  if (!response.ok) {
    const error = await response.json();
    console.error('API Error response:', error);
    throw new Error(error.message || 'Gagal menambahkan psikolog');
  }
  return await response.json();
};

const updatePsychologist = async (id: string, data: Partial<PsychologistFormData>): Promise<any> => {
  const token = localStorage.getItem('token');
  if (!token) throw new Error('Tidak ada token autentikasi');

  // Pastikan specializations diformat dengan benar jika ada
  const formattedData = { ...data };
  if (data.specializations) {
    formattedData.specializations = Array.isArray(data.specializations)
      ? data.specializations.flatMap((item) =>
          typeof item === 'string' && item.includes(',')
            ? item
                .split(',')
                .map((s) => s.trim())
                .filter(Boolean)
            : item
        )
      : [data.specializations].filter(Boolean);
  }

  const response = await fetch(`${API_BASE_URL}/psychologists/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(formattedData),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Gagal memperbarui psikolog');
  }

  return await response.json();
};

const deletePsychologist = async (id: string): Promise<any> => {
  const token = localStorage.getItem('token');
  if (!token) throw new Error('Tidak ada token autentikasi');

  const response = await fetch(`${API_BASE_URL}/psychologists/${id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Gagal menghapus psikolog');
  }

  return await response.json();
};

// Components
const SpecializationTags = ({ specializations }: { specializations: string[] }) => (
  <div className="specializations-container">
    {specializations?.map((specialization, index) => (
      <span key={index} className="specialization-tag">
        {specialization}
      </span>
    ))}
  </div>
);

const EducationList = ({ education }: { education: Education[] }) => {
  return (
    <div className="education-container">
      {education?.map((edu, index) => (
        <div key={index} className="education-item">
          <div className="degree">{edu.degree || '-'}</div>
          <div className="university">{edu.university || '-'}</div>
        </div>
      ))}
    </div>
  );
};

const EducationForm = ({ education, setEducation }: { education: Education[]; setEducation: (education: Education[]) => void }) => {
  const addEducation = () => {
    setEducation([...education, { degree: '', university: '' }]);
  };

  const updateEducation = (index: number, field: keyof Education, value: string) => {
    const newEducation = [...education];
    newEducation[index] = { ...newEducation[index], [field]: value };
    setEducation(newEducation);
  };

  const removeEducation = (index: number) => {
    const newEducation = [...education];
    newEducation.splice(index, 1);
    setEducation(newEducation);
  };

  return (
    <div className="form-group">
      <label>Pendidikan</label>
      {education.map((edu, index) => (
        <div key={index} className="education-input-group">
          <input placeholder="Gelar (Contoh: S1 Psikologi)" value={edu.degree} onChange={(e) => updateEducation(index, 'degree', e.target.value)} />
          <input placeholder="Universitas (Contoh: Universitas Indonesia)" value={edu.university} onChange={(e) => updateEducation(index, 'university', e.target.value)} />
          <button type="button" onClick={() => removeEducation(index)} className="remove-education">
            &times;
          </button>
        </div>
      ))}
      <button type="button" onClick={addEducation} className="add-education">
        + Tambah Pendidikan
      </button>
    </div>
  );
};

const PsychologistModal = ({ isOpen, onClose, editMode, psychologistId, onSubmit }: { isOpen: boolean; onClose: () => void; editMode: boolean; psychologistId: string | null; onSubmit: (data: PsychologistFormData) => Promise<void> }) => {
  const [formData, setFormData] = useState<PsychologistFormData>({
    full_name: '',
    email: '',
    password: '',
    license_number: '',
    specializations: [],
    consultation_fee: 0,
    education: [],
    // available: true,
    description: '',
    address: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch psychologist data if in edit mode
  useEffect(() => {
    const loadPsychologist = async () => {
      if (!editMode || !psychologistId) {
        setFormData({
          full_name: '',
          email: '',
          password: '',
          license_number: '',
          specializations: [],
          consultation_fee: 0,
          education: [],
          description: '',
          address: '',
        });
        return;
      }

      setIsLoading(true);
      try {
        const data = await fetchPsychologistById(psychologistId);
        console.log('Data dari API:', data); // Debugging

        setFormData({
          full_name: data.full_name || '',
          email: data.email || '',
          password: '',
          license_number: data.license_number || '',
          specializations: Array.isArray(data.specializations) ? data.specializations : [data.specializations],
          consultation_fee: Number(data.consultation_fee) || 0,
          education: data.education || [],
          description: data.description || '',
          address: data.address || '',
        });
      } catch (error) {
        console.error('Gagal memuat data:', error);
        toast.error((error as Error).message);
      } finally {
        setIsLoading(false);
      }
    };

    if (isOpen && editMode) {
      // Tambahkan kondisi editMode
      loadPsychologist();
    }
  }, [isOpen, editMode, psychologistId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const dataToSubmit = {
        ...formData,
        consultation_fee: Number(formData.consultation_fee),
        specializations: formData.specializations.filter(Boolean),
      };

      await onSubmit(dataToSubmit);
      onClose();
    } catch (error) {
      console.error('Submit error:', error);
      toast.error((error as Error).message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (field: keyof PsychologistFormData, value: any) => {
    // Jika field adalah specializations dan nilai adalah string, pastikan diparse dengan benar
    if (field === 'specializations' && typeof value === 'string') {
      // Memisahkan berdasarkan titik koma dan memastikan setiap item adalah string terpisah
      const specializations = value
        .split(';')
        .map((item) => item.trim())
        .filter(Boolean);
      setFormData((prev) => ({ ...prev, [field]: specializations }));
    } else {
      setFormData((prev) => ({ ...prev, [field]: value }));
    }
  };

  if (!isOpen) return null;

  return (
    <ErrorBoundary>
      <div className="modal">
        <div className="modal-content">
          <h2>{editMode ? 'Edit Psikolog' : 'Tambah Psikolog Baru'}</h2>

          {isLoading ? (
            <div className="loading">Memuat data...</div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div className="form-row">
                <div className="form-group">
                  <label>Nama Lengkap*</label>
                  <input value={formData.full_name} onChange={(e) => handleChange('full_name', e.target.value)} required />
                </div>

                <div className="form-group">
                  <label>Email*</label>
                  <input type="email" value={formData.email} onChange={(e) => handleChange('email', e.target.value)} required />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Password{!editMode && '*'}</label>
                  <input type="password" value={formData.password} onChange={(e) => handleChange('password', e.target.value)} required={!editMode} />
                  {editMode && <small>Kosongkan jika tidak ingin mengubah password</small>}
                </div>

                <div className="form-group">
                  <label>Nomor Lisensi*</label>
                  <input value={formData.license_number} onChange={(e) => handleChange('license_number', e.target.value)} required />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Spesialisasi*</label>
                  <input
                    value={Array.isArray(formData.specializations) ? formData.specializations.join(';') : ''}
                    onChange={(e) => {
                      // Split by semicolon and format each specialization
                      const specializations = e.target.value
                        .split(';')
                        .map((s) => s.trim())
                        .filter(Boolean);
                      handleChange('specializations', specializations);
                    }}
                    placeholder="Pisahkan dengan titik koma (;)"
                    required
                  />
                  <small>Gunakan titik koma (;) untuk memisahkan spesialisasi</small>
                </div>

                <div className="form-group">
                  <label>Biaya Konsultasi*</label>
                  <input type="number" value={formData.consultation_fee} onChange={(e) => handleChange('consultation_fee', Number(e.target.value))} required min="0" step="10000" />
                </div>
              </div>

              <div className="form-group">
                <label>Deskripsi</label>
                <textarea value={formData.description} onChange={(e) => handleChange('description', e.target.value)} rows={3} />
              </div>

              <div className="form-group">
                <label>Alamat</label>
                <textarea value={formData.address} onChange={(e) => handleChange('address', e.target.value)} rows={2} />
              </div>

              <EducationForm education={formData.education} setEducation={(education) => handleChange('education', education)} />

              <div className="form-actions">
                <button type="button" className="cancel-button" onClick={onClose} disabled={isSubmitting}>
                  Batal
                </button>
                <button type="submit" className="submit-button" disabled={isSubmitting}>
                  {isSubmitting ? 'Menyimpan...' : 'Simpan'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </ErrorBoundary>
  );
};

const DeleteConfirmationModal = ({ isOpen, onClose, onConfirm, isLoading }: { isOpen: boolean; onClose: () => void; onConfirm: () => void; isLoading: boolean }) => {
  if (!isOpen) return null;

  return (
    <div className="modal">
      <div className="modal-content delete-confirmation">
        <h3>Konfirmasi Penghapusan</h3>
        <p>Apakah Anda yakin ingin menghapus psikolog ini? Tindakan ini tidak dapat dibatalkan.</p>

        <div className="confirmation-buttons">
          <button type="button" className="cancel-button" onClick={onClose} disabled={isLoading}>
            Batal
          </button>
          <button type="button" className="delete-confirm-button" onClick={onConfirm} disabled={isLoading}>
            {isLoading ? 'Menghapus...' : 'Ya, Hapus'}
          </button>
        </div>
      </div>
    </div>
  );
};

class ErrorBoundary extends React.Component<{ children: React.ReactNode }, { hasError: boolean }> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error) {
    console.error('Error di modal:', error);
  }

  render() {
    if (this.state.hasError) {
      return <div className="error">Terjadi kesalahan dalam memuat form</div>;
    }
    return this.props.children;
  }
}

// Main Component
const PsychologistsPage = () => {
  const queryClient = useQueryClient();
  const [pagination, setPagination] = useState<PaginationState>({ page: 1, limit: 10 });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedDeleteId, setSelectedDeleteId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Fetch psychologists data
  const { data, isLoading, error } = useQuery<ApiResponse>({
    queryKey: ['psychologists', pagination],
    queryFn: () => fetchPsychologists(pagination),
    staleTime: 5000, // Adjust the stale time as needed
  });

  // Data grid columns
  const columns: GridColDef[] = [
    {
      field: 'id',
      headerName: 'ID',
      width: 90,
    },
    {
      field: 'full_name',
      headerName: 'Nama Lengkap',
      width: 250,
    },
    {
      field: 'email',
      headerName: 'Email',
      width: 250,
    },
    {
      field: 'license_number',
      headerName: 'Nomor Lisensi',
      width: 200,
    },
    {
      field: 'specializations',
      headerName: 'Spesialisasi',
      width: 250,
      renderCell: (params: GridRenderCellParams<Psychologist, string[]>) => <SpecializationTags specializations={params.value || []} />,
    },
    {
      field: 'consultation_fee',
      headerName: 'Biaya Konsultasi',
      width: 180,
      renderCell: (params: GridRenderCellParams<Psychologist>) => {
        const fee = params.row.consultation_fee;
        return fee != null ? `Rp${fee.toLocaleString('id-ID')}` : '-';
      },
    },
    {
      field: 'education',
      headerName: 'Pendidikan',
      width: 300,
      renderCell: (params: GridRenderCellParams<Psychologist, Education[]>) => <EducationList education={params.value || []} />,
    },
    {
      field: 'description',
      headerName: 'Deskripsi',
      width: 300,
      renderCell: (params) => {
        const description = params.row.description;
        if (!description) return '-';
        // Display full description on hover, limit display to 100 characters
        return (
          <div title={description} className="truncated-text">
            {description.length > 100 ? `${description.substring(0, 100)}...` : description}
          </div>
        );
      },
    },
    {
      field: 'address',
      headerName: 'Alamat',
      width: 250,
      renderCell: (params) => {
        const address = params.row.address;
        if (!address) return '-';
        // Display full address on hover, limit display to 100 characters
        return (
          <div title={address} className="truncated-text">
            {address.length > 100 ? `${address.substring(0, 100)}...` : address}
          </div>
        );
      },
    },
    {
      field: 'actions',
      headerName: 'Aksi',
      width: 150,
      sortable: false,
      renderCell: (params: GridRenderCellParams<Psychologist>) => (
        <div className="action-buttons">
          <button onClick={() => handleEdit(params.row.id)} className="edit-button">
            Edit
          </button>
          <button
            onClick={() => {
              setSelectedDeleteId(params.row.id);
              setDeleteModalOpen(true);
            }}
            className="delete-button"
          >
            Hapus
          </button>
        </div>
      ),
    },
  ];

  // Handlers
  const handlePageChange = (newPage: number) => {
    setPagination((prev) => ({ ...prev, page: newPage + 1 }));
  };

  const handlePageSizeChange = (newPageSize: number) => {
    setPagination((prev) => ({ ...prev, limit: newPageSize }));
  };

  const handleAdd = () => {
    setEditMode(false);
    setSelectedId(null);
    setIsModalOpen(true);
  };

  const handleEdit = (id: string) => {
    setEditMode(true);
    setSelectedId(id);
    setIsModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!selectedDeleteId) return;

    setIsDeleting(true);
    try {
      await deletePsychologist(selectedDeleteId);
      queryClient.invalidateQueries({ queryKey: ['psychologists'] });
      toast.success('Psikolog berhasil dihapus');
    } catch (error) {
      toast.error((error as Error).message);
    } finally {
      setIsDeleting(false);
      setDeleteModalOpen(false);
      setSelectedDeleteId(null);
    }
  };

  const handleSubmit = async (formData: PsychologistFormData) => {
    try {
      if (editMode && selectedId) {
        // Remove password if empty when updating
        const dataToUpdate = { ...formData };
        if (!dataToUpdate.password) {
          delete dataToUpdate.password;
        }
        await updatePsychologist(selectedId, dataToUpdate);
        toast.success('Psikolog berhasil diperbarui');
      } else {
        await createPsychologist(formData);
        toast.success('Psikolog berhasil ditambahkan');
      }
      queryClient.invalidateQueries({ queryKey: ['psychologists'] });
    } catch (error) {
      toast.error((error as Error).message);
      throw error; // Rethrow to let the modal handle submission state
    }
  };

  // Rendering
  if (error) {
    return <div className="error-container">Error: {(error as Error).message}</div>;
  }

  return (
    <div className="psychologists-page">
      <ToastContainer position="top-right" autoClose={5000} hideProgressBar={false} newestOnTop closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover />
      <div className="header">
        <h1>Manajemen Psikolog</h1>
        <button onClick={handleAdd} className="add-button">
          + Tambah Psikolog
        </button>
      </div>

      <div className="data-grid-container">
        {isLoading ? (
          <div className="loading">Memuat data...</div>
        ) : (
          <DataGrid
            rows={data?.data || []}
            columns={columns}
            getRowHeight={() => 'auto'}
            sx={{
              '& .MuiDataGrid-cell': {
                py: 1,
              },
              '& .MuiDataGrid-row': {
                maxHeight: 'none !important',
              },
            }}
            pagination
            paginationMode="server"
            rowCount={data?.total || 0}
            paginationModel={{ pageSize: pagination.limit, page: pagination.page - 1 }}
            onPaginationModelChange={(model) => {
              handlePageChange(model.page);
              handlePageSizeChange(model.pageSize);
            }}
            pageSizeOptions={[5, 10, 20, 50]}
            disableRowSelectionOnClick
            autoHeight
            className="data-grid"
          />
        )}
      </div>

      <DeleteConfirmationModal
        isOpen={deleteModalOpen}
        onClose={() => {
          setDeleteModalOpen(false);
          setSelectedDeleteId(null);
        }}
        onConfirm={handleConfirmDelete}
        isLoading={isDeleting}
      />
      <PsychologistModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} editMode={editMode} psychologistId={selectedId} onSubmit={handleSubmit} />
    </div>
  );
};

export default PsychologistsPage;
