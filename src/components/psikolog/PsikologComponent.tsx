import { fetchPsychologistById } from '../../../src/services/psikologService';
import { Education, PsychologistFormData } from '../../../src/utils/Psikolog';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';

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
  // Data awal yang kosong untuk reset form
  const initialFormData: PsychologistFormData = {
    full_name: '',
    email: '',
    password: '',
    license_number: '',
    specializations: [],
    consultation_fee: 0,
    education: [],
    description: '',
    address: '',
  };

  // Gunakan initialFormData sebagai nilai awal
  const [formData, setFormData] = useState<PsychologistFormData>(initialFormData);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const loadPsychologist = async () => {
      if (!editMode || !psychologistId) {
        setFormData(initialFormData);
        return;
      }

      setIsLoading(true);
      try {
        const response = await fetchPsychologistById(psychologistId);
        console.log('Data dari API:', response.data); // Debugging

        if (response.data) {
          setFormData({
            full_name: response.data.full_name || '',
            email: response.data.email || '',
            password: '', // Jangan tampilkan password
            license_number: response.data.license_number || '',
            specializations: Array.isArray(response.data.specializations) ? response.data.specializations : [response.data.specializations],
            consultation_fee: Number(response.data.consultation_fee) || 0,
            education: response.data.education || [],
            description: response.data.description || '',
            address: response.data.address || '',
          });
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        toast.error((error as Error).message);
      } finally {
        setIsLoading(false);
      }
    };

    if (isOpen) {
      loadPsychologist();
    }
  }, [isOpen, psychologistId]);

  const handleClose = () => {
    setFormData(initialFormData);
    onClose();
  };

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
                  value={formData.specializations.join('; ')}
                  onChange={(e) => {
                    const values = e.target.value
                      .split(';')
                      .map((s) => s.trim())
                      .filter(Boolean);
                    handleChange('specializations', values);
                  }}
                  placeholder="Pisahkan dengan titik koma (;) contoh: Klinis; Industri"
                  required
                />
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
              <button type="button" className="cancel-button" onClick={handleClose} disabled={isSubmitting}>
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
  );
};

export {
  PsychologistModal,
  SpecializationTags,
  EducationList,
  EducationForm,
  // Tambahkan komponen lain yang diperlukan di sini
};
