import { initializeApp } from 'firebase/app';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { getFirestore, collection, addDoc, getDocs, query, Timestamp } from 'firebase/firestore';
import { getAuth, signInWithCustomToken } from 'firebase/auth';
import { readFileSync, execSync } from 'fs';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

const firebaseConfig = {
  apiKey: "AIzaSyAcA_4yYQym5sbB9F_58FJEPuhbAevq_eI",
  authDomain: "liting-art-gallery.firebaseapp.com",
  projectId: "liting-art-gallery",
  storageBucket: "liting-art-gallery.firebasestorage.app",
  messagingSenderId: "347447914620",
  appId: "1:347447914620:web:e56370c445bf7512d619f9"
};

const app = initializeApp(firebaseConfig);
const storage = getStorage(app);
const db = getFirestore(app);

async function getAccessToken() {
  const { stdout } = await execAsync('gcloud auth print-access-token --account=pin0513@gmail.com');
  return stdout.trim();
}

async function uploadImageViaREST(localPath, storagePath, accessToken) {
  const { default: fetch } = await import('node-fetch');
  const bytes = readFileSync(localPath);
  
  const bucket = 'liting-art-gallery.firebasestorage.app';
  const encodedPath = encodeURIComponent(storagePath);
  const uploadUrl = `https://storage.googleapis.com/upload/storage/v1/b/${bucket}/o?uploadType=media&name=${encodedPath}`;
  
  const response = await fetch(uploadUrl, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'image/png',
      'Content-Length': bytes.length,
    },
    body: bytes,
  });
  
  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Upload failed: ${response.status} ${text}`);
  }
  
  const data = await response.json();
  const downloadUrl = `https://firebasestorage.googleapis.com/v0/b/${bucket}/o/${encodedPath}?alt=media&token=${data.metadata?.firebaseStorageDownloadTokens || ''}`;
  
  // Generate a proper public URL using the media link
  const publicUrl = `https://storage.googleapis.com/${bucket}/${storagePath}`;
  
  // Actually use download URL format that Firebase uses
  const firebaseUrl = `https://firebasestorage.googleapis.com/v0/b/${bucket}/o/${encodedPath}?alt=media`;
  
  console.log('Uploaded:', storagePath);
  return firebaseUrl;
}

async function main() {
  console.log('Getting access token...');
  const accessToken = await getAccessToken();
  console.log('Got access token');
  
  // Get artist ID
  const snap = await getDocs(query(collection(db, 'artists')));
  let artistId = null;
  for (const doc of snap.docs) {
    const data = doc.data();
    if (data.name && data.name.toLowerCase().includes('liting')) {
      artistId = doc.id;
      console.log('Artist:', data.name, '/', artistId);
      break;
    }
  }
  
  const ts = Date.now();
  
  console.log('\nUploading Portrait...');
  const imageUrl1 = await uploadImageViaREST('/tmp/artwork1_portrait.png', `artworks/${ts}_portrait/original.png`, accessToken);
  
  console.log('Uploading Surreal Fantasy...');
  const imageUrl2 = await uploadImageViaREST('/tmp/artwork2_surreal.png', `artworks/${ts}_surreal/original.png`, accessToken);
  
  console.log('\nCreating Firestore records...');
  
  const doc1 = await addDoc(collection(db, 'artworks'), {
    title: '凝視',
    description: '以炭筆與墨水勾勒的靜思女子肖像，強烈的明暗對比展現靈魂深處的沉靜之美。每一筆細線都訴說著時光的流轉與生命的厚度。',
    imageUrl: imageUrl1,
    thumbnailUrl: imageUrl1,
    artistId: artistId,
    tags: ['人物', '炭筆', '黑白', '女性肖像', '手繪'],
    year: 2024,
    featured: true,
    order: 1,
    createdAt: Timestamp.now(),
  });
  console.log('Created artwork 1:', doc1.id);

  const doc2 = await addDoc(collection(db, 'artworks'), {
    title: '浮城',
    description: '懸浮於暮色天際的古典建築群，東方宮殿與西方廢墟在超現實的夢境中交融。月牙低垂，雲霧繚繞，訴說著文明消逝後殘存的永恆記憶。',
    imageUrl: imageUrl2,
    thumbnailUrl: imageUrl2,
    artistId: artistId,
    tags: ['超現實', '建築', '黑白', '奇幻', '水墨'],
    year: 2024,
    featured: true,
    order: 2,
    createdAt: Timestamp.now(),
  });
  console.log('Created artwork 2:', doc2.id);

  console.log('\n✅ Done! Two artworks uploaded.');
  process.exit(0);
}

main().catch(err => {
  console.error('Error:', err.message || err);
  process.exit(1);
});
