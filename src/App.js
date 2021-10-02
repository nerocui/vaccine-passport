import { useCallback, useMemo, useState } from 'react';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import { styled } from '@mui/material/styles';
import QrScanner from 'qr-scanner';
import './App.css';
// eslint-disable-next-line import/no-webpack-loader-syntax
import QrScannerWorkerPath from '!!file-loader!../node_modules/qr-scanner/qr-scanner-worker.min';

QrScanner.WORKER_PATH = QrScannerWorkerPath;

const Input = styled('input')({
  display: 'none',
});

const App = () => {
  const existingFile = localStorage.getItem('imagePath');
  const [img, setImg] = useState(existingFile);
  const [errorString, setErrorString] = useState();
  const reader = useMemo(() => {
    const res = new FileReader();
    res.onload = function() {
      QrScanner.scanImage(res.result)
        .then(code => {
          if (code.startsWith('shc:')) {
            setImg(res.result);
            localStorage.setItem('imagePath', res.result);
          } else {
            setErrorString('Invalid QR Code');
          }
        })
        .catch(err => setErrorString('Invalid QR Code'));
    };
    return res;
  }, [setImg, setErrorString]);

  const onFileChange = useCallback((event) => {
    reader.readAsDataURL(event.target.files[0]);
    setErrorString(undefined);
  }, [reader, setErrorString]);

  const onDelete = useCallback(() => {
    if (!!img) {
      // eslint-disable-next-line no-restricted-globals
      let conf = confirm('Remove your Vaccine Card?');
      if (conf) {
        setImg(undefined);
        localStorage.removeItem('imagePath');
      }
    }
  }, [img, setImg]);

  return (
    <Stack margin='0' height='100%' alignItems='center' justifyContent='space-between'>
      <h1>Vaccine Passport</h1>
      <Stack padding='1rem' justifyContent='center'>
        {!img && 
        <label htmlFor="contained-button-file">
          <Input onChange={onFileChange} accept="image/*" id="contained-button-file" type="file" />
          <Button variant="contained" component="span">
            Upload
          </Button>
        </label>}
        <p style={{ color: 'red' }}>{errorString}</p>
        {!!img && 
          <Stack spacing='1rem'>
            <img src={img} alt='covid vaccine qr code'/>
            <Button
              variant='contained'
              color='error'
              onClick={onDelete}>
              Delete
            </Button>
          </Stack>
        }
      </Stack>
    </Stack>
  );
}

export default App;
