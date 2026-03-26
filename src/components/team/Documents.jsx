import { useState, useRef } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Upload, Download, Trash2, Plus, FileText } from 'lucide-react';

export default function Documents({ isAdmin, user }) {
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [formData, setFormData] = useState({ title: '', description: '', category: 'other' });
  const [selectedFile, setSelectedFile] = useState(null);
  const fileInputRef = useRef(null);
  const queryClient = useQueryClient();

  const { data: documents = [] } = useQuery({
    queryKey: ['teamDocuments'],
    queryFn: () => base44.entities.TeamDocument.list('-created_date'),
    initialData: [],
  });

  const uploadMutation = useMutation({
    mutationFn: async (data) => {
      if (!selectedFile) return;
      const uploadedFile = await base44.integrations.Core.UploadFile({ file: selectedFile });
      return base44.entities.TeamDocument.create({
        title: data.title,
        description: data.description,
        category: data.category,
        file_url: uploadedFile.file_url,
        file_type: selectedFile.type,
        uploaded_by_email: user.email,
        uploaded_by_name: user.full_name,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['teamDocuments'] });
      setFormData({ title: '', description: '', category: 'other' });
      setSelectedFile(null);
      setShowUploadForm(false);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (docId) => base44.entities.TeamDocument.delete(docId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['teamDocuments'] });
    },
  });

  const handleUpload = () => {
    if (!formData.title || !selectedFile) return;
    uploadMutation.mutate(formData);
  };

  const filteredDocs = selectedCategory === 'all' 
    ? documents 
    : documents.filter((doc) => doc.category === selectedCategory);

  const categories = ['all', 'policy', 'procedure', 'template', 'report', 'other'];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Documents</h1>
          <p className="text-slate-400">Manage and share team documents</p>
        </div>
        {isAdmin && (
          <button
            onClick={() => setShowUploadForm(!showUploadForm)}
            className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-pink-500 hover:from-blue-600 hover:to-pink-600 text-white px-6 py-3 rounded-lg transition-all duration-200 shadow-lg"
          >
            <Plus size={20} /> Upload Document
          </button>
        )}
      </div>

      {/* Upload Form */}
      {showUploadForm && isAdmin && (
        <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl p-6 border border-slate-700 shadow-lg">
          <h2 className="text-xl font-bold text-white mb-4">Upload New Document</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Document Title</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Enter document title"
                className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Enter document description"
                className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 transition-all h-24"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Category</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500 transition-all"
              >
                <option value="policy">Policy</option>
                <option value="procedure">Procedure</option>
                <option value="template">Template</option>
                <option value="report">Report</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">File</label>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="w-full border-2 border-dashed border-slate-600 rounded-lg p-6 text-center hover:border-blue-500 transition-all cursor-pointer group"
              >
                <Upload className="mx-auto mb-2 text-slate-400 group-hover:text-blue-400 transition-all" size={24} />
                <p className="text-slate-300 font-medium">{selectedFile?.name || 'Click to select file'}</p>
              </button>
              <input
                ref={fileInputRef}
                type="file"
                onChange={(e) => setSelectedFile(e.target.files?.[0])}
                className="hidden"
              />
            </div>
            <div className="flex gap-3 pt-4">
              <button
                onClick={handleUpload}
                disabled={uploadMutation.isPending || !formData.title || !selectedFile}
                className="flex-1 bg-gradient-to-r from-blue-500 to-pink-500 hover:from-blue-600 hover:to-pink-600 disabled:opacity-50 text-white py-2 rounded-lg font-medium transition-all duration-200"
              >
                {uploadMutation.isPending ? 'Uploading...' : 'Upload'}
              </button>
              <button
                onClick={() => setShowUploadForm(false)}
                className="flex-1 bg-slate-700 hover:bg-slate-600 text-white py-2 rounded-lg font-medium transition-all"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Category Filter */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-2 rounded-lg font-medium transition-all whitespace-nowrap ${
              selectedCategory === cat
                ? 'bg-gradient-to-r from-blue-500 to-pink-500 text-white'
                : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
            }`}
          >
            {cat.charAt(0).toUpperCase() + cat.slice(1)}
          </button>
        ))}
      </div>

      {/* Documents Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredDocs.length > 0 ? (
          filteredDocs.map((doc) => (
            <div
              key={doc.id}
              className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl p-6 border border-slate-700 hover:border-slate-600 transition-all shadow-lg group"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="bg-gradient-to-br from-blue-500 to-pink-500 p-3 rounded-lg group-hover:scale-110 transition-transform">
                  <FileText className="w-6 h-6 text-white" />
                </div>
                {isAdmin && (
                  <button
                    onClick={() => deleteMutation.mutate(doc.id)}
                    className="text-slate-400 hover:text-red-400 transition-all opacity-0 group-hover:opacity-100"
                  >
                    <Trash2 size={18} />
                  </button>
                )}
              </div>
              <h3 className="text-white font-bold mb-2 line-clamp-2">{doc.title}</h3>
              <p className="text-slate-400 text-sm mb-3 line-clamp-2">{doc.description}</p>
              <div className="flex items-center justify-between pt-4 border-t border-slate-700">
                <span className="text-xs text-slate-500">{doc.uploaded_by_name}</span>
                <a
                  href={doc.file_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-400 hover:text-blue-300 transition-all flex items-center gap-1"
                >
                  <Download size={16} />
                </a>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full text-center py-12">
            <FileText className="mx-auto mb-4 text-slate-500" size={32} />
            <p className="text-slate-400">No documents in this category</p>
          </div>
        )}
      </div>
    </div>
  );
}