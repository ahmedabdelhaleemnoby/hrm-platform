import { EmployeeDocument, employeeApi } from '@/api/employees';
import {
    Delete as DeleteIcon,
    GetApp as DownloadIcon,
    Description as FileIcon,
    CloudUpload as UploadIcon,
} from '@mui/icons-material';
import {
    Box,
    Button,
    CircularProgress,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    IconButton,
    List,
    ListItem,
    ListItemIcon,
    ListItemSecondaryAction,
    ListItemText,
    TextField,
    Typography
} from '@mui/material';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

interface DocumentManagerProps {
  employeeId: number;
  documents: EmployeeDocument[];
  onUpdate: () => void;
}

const DocumentManager: React.FC<DocumentManagerProps> = ({ employeeId, documents, onUpdate }) => {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [fileName, setFileName] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  const handleUpload = async () => {
    if (!file || !fileName) return;

    setUploading(true);
    try {
      await employeeApi.uploadDocument(employeeId, file, fileName);
      onUpdate();
      setOpen(false);
      setFile(null);
      setFileName('');
    } catch (error) {
      console.error('Upload failed:', error);
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (docId: number) => {
    if (!window.confirm(t('common.confirmDelete'))) return;
    try {
      await employeeApi.deleteDocument(docId);
      onUpdate();
    } catch (error) {
      console.error('Delete failed:', error);
    }
  };

  const formatSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6" fontWeight="bold">
          {t('common.documents')}
        </Typography>
        <Button
          variant="contained"
          startIcon={<UploadIcon />}
          onClick={() => setOpen(true)}
          size="small"
        >
          {t('common.upload')}
        </Button>
      </Box>

      {documents.length > 0 ? (
        <List>
          {documents.map((doc) => (
            <ListItem 
              key={doc.id}
              sx={{ 
                border: '1px solid', 
                borderColor: 'divider', 
                borderRadius: 2, 
                mb: 1,
                '&:hover': { bgcolor: 'action.hover' }
              }}
            >
              <ListItemIcon>
                <FileIcon color="primary" />
              </ListItemIcon>
              <ListItemText
                primary={doc.name}
                secondary={`${doc.file_type.toUpperCase()} • ${formatSize(doc.file_size)} • ${new Date(doc.created_at).toLocaleDateString()}`}
              />
              <ListItemSecondaryAction>
                <IconButton 
                  edge="end" 
                  aria-label="download" 
                  href={`/storage/${doc.file_path}`} 
                  target="_blank"
                  sx={{ mr: 1 }}
                >
                  <DownloadIcon />
                </IconButton>
                <IconButton 
                  edge="end" 
                  aria-label="delete"
                  onClick={() => handleDelete(doc.id)}
                  color="error"
                >
                  <DeleteIcon />
                </IconButton>
              </ListItemSecondaryAction>
            </ListItem>
          ))}
        </List>
      ) : (
        <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 4 }}>
          {t('common.noDocuments')}
        </Typography>
      )}

      <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="xs">
        <DialogTitle>{t('common.uploadDocument')}</DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              label={t('common.documentName')}
              fullWidth
              value={fileName}
              onChange={(e) => setFileName(e.target.value)}
            />
            <Button
              variant="outlined"
              component="label"
              fullWidth
              startIcon={<FileIcon />}
            >
              {file ? file.name : t('common.selectFile')}
              <input
                type="file"
                hidden
                onChange={(e) => {
                  const selectedFile = e.target.files?.[0];
                  if (selectedFile) {
                    setFile(selectedFile);
                    if (!fileName) setFileName(selectedFile.name.split('.')[0]);
                  }
                }}
              />
            </Button>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>{t('common.cancel')}</Button>
          <Button
            onClick={handleUpload}
            variant="contained"
            disabled={!file || !fileName || uploading}
          >
            {uploading ? <CircularProgress size={24} /> : t('common.upload')}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default DocumentManager;
