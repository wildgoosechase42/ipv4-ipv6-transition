export interface FlowGenerateImageParams {
  prompt: string;
  modelDisplayName?: string;
  aspectRatio?: string;
}

export interface FlowGenerateImageResult {
  base64: string;
  mimeType: string;
}

export interface FlowDownloadParams {
  base64: string;
  mimeType: string;
  filename: string;
}

export const Flow = {
  generate: {
    image: async (_params: FlowGenerateImageParams): Promise<FlowGenerateImageResult> => {
      if (typeof window === 'undefined') {
        return {
          base64: 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII=',
          mimeType: 'image/png',
        };
      }
      const canvas = document.createElement('canvas');
      canvas.width = 960;
      canvas.height = 540;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.fillStyle = '#030305';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
        gradient.addColorStop(0, '#022c22');
        gradient.addColorStop(0.5, '#064e3b');
        gradient.addColorStop(1, '#051923');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;

        for (let i = 0; i < 48; i++) {
          const angle = (i / 48) * Math.PI * 2;
          const endX = centerX + Math.cos(angle) * canvas.width;
          const endY = centerY + Math.sin(angle) * canvas.height;
          ctx.beginPath();
          ctx.moveTo(centerX, centerY);
          ctx.lineTo(endX, endY);
          ctx.strokeStyle = i % 2 === 0 ? 'rgba(52, 211, 153, 0.4)' : 'rgba(212, 175, 55, 0.3)';
          ctx.lineWidth = i % 4 === 0 ? 3 : 1;
          ctx.stroke();
        }

        for (let j = 0; j < 6; j++) {
          const radius = (j + 1) * 70;
          ctx.beginPath();
          ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
          ctx.strokeStyle = 'rgba(16, 185, 129, 0.5)';
          ctx.lineWidth = 1.5;
          ctx.stroke();
        }

        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 24px monospace';
        ctx.textAlign = 'center';
        ctx.fillText('128-BIT INFINITE HYPER-LATTICE', centerX, centerY - 15);

        ctx.fillStyle = '#34d399';
        ctx.font = '14px monospace';
        ctx.fillText('2001:0DB8:85A3:0000:0000:8A2E:0370:7334', centerX, centerY + 20);
      }
      const dataUrl = canvas.toDataURL('image/png');
      const base64 = dataUrl.replace(/^data:image\/png;base64,/, '');
      return {
        base64,
        mimeType: 'image/png',
      };
    },
  },
  download: async (params: FlowDownloadParams): Promise<void> => {
    if (typeof window === 'undefined') return;
    const link = document.createElement('a');
    link.href = params.base64.startsWith('data:')
      ? params.base64
      : `data:${params.mimeType};base64,${params.base64}`;
    link.download = params.filename || 'export.png';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  },
};
