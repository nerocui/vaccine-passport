import { useCallback, useMemo, useState } from 'react';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import { styled } from '@mui/material/styles';
import './App.css';

const Input = styled('input')({
  display: 'none',
});

const App = () => {
  const existingFile = useMemo(() => {
    return localStorage.getItem('imagePath');
  }, []);
  const [img, setImg] = useState(existingFile);
  const reader = useMemo(() => {
    const res = new FileReader();
    res.onload = function() {
      setImg(res.result);
      localStorage.setItem('imagePath', res.result);
    };
    return res;
  }, [setImg]);
  const onFileChange = useCallback((event) => {
    reader.readAsDataURL(event.target.files[0]);
  }, [reader]);

  return (
    <Stack paddingTop='2rem' height='100%' alignItems='center' textAlign='end' justifyContent='space-between'>
      <h1>Vaccine Passport</h1>
      <Stack paddingX='1rem' marginBottom='8rem' justifyContent='center' justifySelf='center'>
        {!img && 
        <label htmlFor="contained-button-file">
          <Input onChange={onFileChange} accept="image/*" id="contained-button-file" multiple type="file" />
          <Button variant="contained" component="span">
            Upload
          </Button>
        </label>}
        {!!img && <img src={img} alt='covid vaccine qr code'/>}
      </Stack>
    </Stack>
    
  );
}

export default App;
