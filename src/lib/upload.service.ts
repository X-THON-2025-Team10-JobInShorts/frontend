const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

export async function getPresignedUrl({ ownerPid, file }: { ownerPid: string; file: File }) {
  const res = await fetch(`${BACKEND_URL}/short-forms/upload-url`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      ownerPid,
      fileName: file.name,
      mimeType: file.type,
      size: file.size,
    }),
  });

  if (!res.ok) throw new Error('Presigned URL 요청 실패');

  return res.json() as Promise<{
    uploadUrl: string;
    videoKey: string;
  }>;
}

export async function uploadToPresignedUrl(
  uploadUrl: string,
  file: File,
  onProgress: (p: number) => void,
) {
  return new Promise<void>((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open('PUT', uploadUrl);
    xhr.setRequestHeader('Content-Type', file.type);

    // 진행률
    xhr.upload.onprogress = e => {
      if (e.lengthComputable) {
        const percent = Math.round((e.loaded / e.total) * 100);
        onProgress(percent);
      }
    };

    xhr.onload = () => {
      if (xhr.status === 200) resolve();
      else reject(new Error(`업로드 실패: ${xhr.status}`));
    };

    xhr.onerror = () => reject(new Error('네트워크 오류'));

    xhr.send(file);
  });
}
