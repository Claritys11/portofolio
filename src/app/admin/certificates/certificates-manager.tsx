'use client';

import { useState, useEffect } from 'react';
import { CertificateForm } from './certificate-form';
import { createCertificate, updateCertificate, deleteCertificate } from './actions';
import { getAllCertificates } from '@/lib/certificates';
import type { Certificate } from '@/lib/types';
import { Button } from '@/components/ui/button';

export function CertificatesManager() {
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [editingCertificate, setEditingCertificate] = useState<Certificate | null>(null);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  useEffect(() => {
    setCertificates(getAllCertificates());
  }, []);

  const handleSave = async (values: Omit<Certificate, 'id'>) => {
    if (editingIndex !== null) {
      await updateCertificate(editingIndex, values);
      setEditingCertificate(null);
      setEditingIndex(null);
    } else {
      await createCertificate(values);
    }
    setCertificates(getAllCertificates());
  };

  const handleDelete = async (index: number) => {
    await deleteCertificate(index);
    setCertificates(getAllCertificates());
  };

  const handleEdit = (index: number) => {
    setEditingCertificate(certificates[index]);
    setEditingIndex(index);
  };

  const handleCancelEdit = () => {
    setEditingCertificate(null);
    setEditingIndex(null);
  };

  return (
    <div className="py-8 space-y-8">
      <CertificateForm
        key={editingIndex} // Reset form when editing a new certificate
        certificate={editingCertificate}
        onSave={handleSave}
        onDelete={editingIndex !== null ? () => handleDelete(editingIndex) : undefined}
      />

      {editingCertificate && (
        <Button variant="outline" onClick={handleCancelEdit}>
          Cancel Edit
        </Button>
      )}

      <div className="mt-8">
        <h2 className="text-2xl font-headline font-semibold">Your Certificates</h2>
        <ul className="mt-4 space-y-4">
          {certificates.map((cert, index) => (
            <li key={index} className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <h3 className="font-bold text-lg">{cert.title}</h3>
                <p className="text-muted-foreground">{cert.issuer} - {cert.year}</p>
              </div>
              <div className="flex space-x-2">
                <Button variant="outline" size="sm" onClick={() => handleEdit(index)}>
                  Edit
                </Button>
                <Button variant="destructive" size="sm" onClick={() => handleDelete(index)}>
                  Delete
                </Button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
