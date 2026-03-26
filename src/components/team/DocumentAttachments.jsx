import { useState } from 'react';
import { Paperclip, X, Download, File, Image, FileText } from 'lucide-react';

export default function DocumentAttachments({ attachments = [], onAddAttachment, onRemoveAttachment, isLoading = false }) {
  const getFileIcon = (fileType) => {
    if (fileType.startsWith('image/')) return <Image size={16} className="text-blue-400" />;
    if (fileType.includes('pdf')) return <FileText size={16} className="text-red-400" />;
    if (fileType.includes('word') || fileType.includes('document')) return <FileText size={16} className="text-blue-400" />;
    if (fileType.includes('sheet') || fileType.includes('excel')) return <FileText size={16} className="text-green-400" />;
    return <File size={16} className="text-slate-400" />;
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
  };

  return (
    <div className="space-y-3">
      {/* Upload Area */}
      <label className="flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-700 hover:bg-slate-600 text-slate-300 cursor-pointer transition-all">
        {isLoading ? (
          <>
            <div className="w-4 h-4 border-2 border-slate-400 border-t-transparent rounded-full animate-spin"></div>
            <span className="text-sm">Uploading...</span>
          </>
        ) : (
          <>
            <Paperclip size={16} />
            <span className="text-sm">Attach Files</span>
          </>
        )}
        <input
          type="file"
          multiple
          onChange={onAddAttachment}
          disabled={isLoading}
          className="hidden"
        />
      </label>

      {/* Attachments List */}
      {attachments.length > 0 && (
        <div className="space-y-2 p-3 bg-slate-700/50 rounded-lg border border-slate-600">
          <p className="text-xs text-slate-400 font-semibold">Attachments ({attachments.length})</p>
          {attachments.map((attachment, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between p-2 bg-slate-600 rounded hover:bg-slate-500 transition-all group"
            >
              <div className="flex items-center gap-2 flex-1 min-w-0">
                {getFileIcon(attachment.file_type)}
                <div className="min-w-0 flex-1">
                  <p className="text-sm text-white truncate">{attachment.file_name}</p>
                  <p className="text-xs text-slate-400">{formatFileSize(attachment.file_size)}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                {attachment.file_url && (
                  <a
                    href={attachment.file_url}
                    download={attachment.file_name}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-slate-300 hover:text-blue-400 transition-colors"
                    title="Download"
                  >
                    <Download size={14} />
                  </a>
                )}
                {onRemoveAttachment && (
                  <button
                    onClick={() => onRemoveAttachment(idx)}
                    className="text-slate-300 hover:text-red-400 transition-colors"
                    title="Remove"
                  >
                    <X size={14} />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}