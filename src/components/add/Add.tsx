import React, { useState } from 'react';

type Props = {
  slug: string;
  columns: any;
  setOpen: (open: boolean) => void;
};

const Add = ({ slug, columns, setOpen }: Props) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    foto: '', // URL untuk foto avatar
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const response = await fetch('http://localhost:3000/api/users/add-psikolog', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
      body: JSON.stringify(formData),
    });

    if (response.ok) {
      alert('Psikolog berhasil ditambahkan');
      setOpen(false); // Close modal after success
    } else {
      alert('Terjadi kesalahan. Silakan coba lagi.');
    }
  };

  return (
    <div className="add-modal">
      <div className="modal-content">
        <h2>Tambah Psikolog</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>First Name</label>
            <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>Last Name</label>
            <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>Email</label>
            <input type="email" name="email" value={formData.email} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>Phone</label>
            <input type="text" name="phone" value={formData.phone} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>Foto URL</label>
            <input type="text" name="foto" value={formData.foto} onChange={handleChange} />
          </div>
          <div className="form-actions">
            <button type="submit" className="submit-btn">
              Tambah
            </button>
            <button type="button" className="cancel-btn" onClick={() => setOpen(false)}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Add;
