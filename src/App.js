import { useCallback, useEffect, useMemo, useState } from 'react';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import { styled } from '@mui/material/styles';
import ReactCardFlip from 'react-card-flip';
import QrScanner from 'qr-scanner';

import './App.css';
// eslint-disable-next-line import/no-webpack-loader-syntax
import QrScannerWorkerPath from '!!file-loader!../node_modules/qr-scanner/qr-scanner-worker.min';
import { InfoCard } from './components/info-card';

QrScanner.WORKER_PATH = QrScannerWorkerPath;

const Input = styled('input')({
  display: 'none',
});

const App = () => {
  const existingFile = localStorage.getItem('imagePath');
  const [isFlipped, setIsFlipped] = useState(false);
  const [img, setImg] = useState(existingFile);
  const [errorString, setErrorString] = useState();
  const [code, setCode] = useState();
  const reader = useMemo(() => {
    const res = new FileReader();
    res.onload = function() {
      QrScanner.scanImage(res.result)
        .then(resCode => {
          if (resCode.startsWith('shc:')) {
            setImg(res.result);
            setCode(resCode);
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
        setCode(undefined);
        setErrorString(undefined);
		setIsFlipped(false);
        localStorage.removeItem('imagePath');
      }
    }
  }, [img, setImg, setCode, setErrorString, setIsFlipped]);

  const onFlip = useCallback(() => {
    setIsFlipped(!isFlipped);
  }, [isFlipped, setIsFlipped]);

  useEffect(() => {
	  if (!!img && !code) {
		QrScanner.scanImage(img)
			.then(resCode => {
				if (resCode.startsWith('shc:')) {
					setCode(resCode);
				} else {
					setErrorString('Invalid QR Code');
				}
			})
			.catch(err => setErrorString('Invalid QR Code'))
	  }
  }, [img, code, setCode, setErrorString]);

  return (
    <div id='app'>
      	<h1 id='app-title'>Vaccine Passport</h1>
		{!img && 
		<label
			className='center'
			htmlFor="contained-button-file">
			<Input onChange={onFileChange} accept="image/*" id="contained-button-file" type="file" />
			<Button variant="contained" component="span">
			Upload
			</Button>
		</label>}
		{!!errorString && <p className='bottom' style={{ color: 'red' }}>{errorString}</p>}
		{(!!img && !errorString) && 
			<div
				id='flipper'
				className='center'>
				<ReactCardFlip 
					isFlipped={isFlipped} 
					flipDirection='horizontal'>
					<div
						onClick={onFlip}
						className='flipper-container'>
						<img src={img} alt='covid vaccine qr code'/>
					</div>
					<InfoCard code={code} onClick={onFlip}/>
				</ReactCardFlip>
			</div>
			
		}
		{(!!img && !errorString) &&
			<Button
				id='delete'
				variant='contained'
				color='error'
				onClick={onDelete}>
				Delete
			</Button>
		}
    </div>
  );
}

export default App;
