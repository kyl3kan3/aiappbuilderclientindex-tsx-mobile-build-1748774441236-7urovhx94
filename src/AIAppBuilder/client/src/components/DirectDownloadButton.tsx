import React from 'react';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';

interface DirectDownloadButtonProps {
  code: string;
  filename: string;
  label: string;
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
  size?: 'default' | 'sm' | 'lg' | 'icon';
}

/**
 * A button component that directly downloads code as a file when clicked
 */
export function DirectDownloadButton({
  code,
  filename,
  label,
  variant = 'outline',
  size = 'sm'
}: DirectDownloadButtonProps) {
  
  // Function to handle the download
  const handleDownload = () => {
    try {
      // Create a very simple download method using the native browser approach
      const downloadLink = document.createElement('a');
      downloadLink.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(code));
      downloadLink.setAttribute('download', filename);
      downloadLink.style.display = 'none';
      document.body.appendChild(downloadLink);
      
      // Click the link and remove it afterward
      downloadLink.click();
      document.body.removeChild(downloadLink);
      
      console.log('Download initiated for', filename);
    } catch (error) {
      console.error('Download error:', error);
      alert('Could not download the file. Please try again.');
    }
  };
  
  return (
    <Button variant={variant} size={size} onClick={handleDownload}>
      <Download className="h-4 w-4 mr-1" /> {label}
    </Button>
  );
}