import { Typography, CardContent, Divider } from "@mui/material"
import { useEffect, useState } from "react";
import decode from "shc-protocol";

export const InfoCard = ({ code, onClick }) => {
    const [patient, setPatient] = useState();
    const [firstShot, setFirstShot] = useState();
    const [secondShot, setSecondShot] = useState();
    
    useEffect(() => {
        if(!!code) {
          decode(code)
            .then(res => {
                const entries = res.payload.vc.credentialSubject.fhirBundle.entry;
                if (!!entries) {
                    const patients = entries.filter(e => e.resource.resourceType === 'Patient');
                    if (patients && patients.length > 0) {
                        setPatient(patients[0]);
                    }
                    const shots = entries
                        .filter(e => e.resource.resourceType === 'Immunization')
                        .sort((a, b) => new Date(a.resource.occurrenceDateTime) - new Date(b.resource.occurrenceDateTime));
                    if (shots && shots.length > 0) {
                        setFirstShot(shots[0]);
                        if (shots.length > 1) {
                            setSecondShot(shots[1]);
                        }
                    }
                }
            })
            .catch(err => console.log('Failed to decode QR Code'));
        }
      }, [code, setPatient, setFirstShot, setSecondShot])

    if (!code) {
        return null;
    }

    return (
        <div onClick={onClick} className='flipper-container' style={{ border: '1px solid grey', borderRadius: '1rem' }}>
            <CardContent>
                <Typography sx={{ fontSize: 14 }} color='text.grey'>
                    Name
                </Typography>
                <Typography variant="h6" component="p">
                    {`${patient?.resource?.name[0]?.given.map(name => `${name} `)} ${patient?.resource?.name[0]?.family}`}
                </Typography>
                <Typography sx={{ fontSize: 14 }}>
                    Birthday
                </Typography>
                <Typography variant="h6" component="p">
                    {patient?.resource?.birthDate}
                </Typography>

                <Divider style={{ borderColor: 'grey' }}/>

                <Typography sx={{ fontSize: 18 }}>
                    First Shot
                </Typography>
                <Typography sx={{ fontSize: 14 }}>
                    Date
                </Typography>
                <Typography variant="h7" component="p">
                    {firstShot?.resource?.occurrenceDateTime}
                </Typography>
                <Typography sx={{ fontSize: 14 }}>
                    Lot Number
                </Typography>
                <Typography variant="h7" component="p">
                    {firstShot?.resource?.lotNumber}
                </Typography>
                <Typography sx={{ fontSize: 14 }}>
                    Taken By
                </Typography>
                <Typography variant="h7" component="p">
                    {firstShot?.resource?.performer.map(p => `${p.actor.display},`)}
                </Typography>
                <Typography sx={{ fontSize: 14 }}>
                    Status
                </Typography>
                <Typography variant="h7" component="p">
                    {firstShot?.resource?.status}
                </Typography>

                <Divider style={{ borderColor: 'grey' }}/>

                <Typography sx={{ fontSize: 18 }}>
                    Second Shot
                </Typography>
                <Typography sx={{ fontSize: 14 }}>
                    Date
                </Typography>
                <Typography variant="h7" component="p">
                    {secondShot?.resource?.occurrenceDateTime}
                </Typography>
                <Typography sx={{ fontSize: 14 }}>
                    Lot Number
                </Typography>
                <Typography variant="h7" component="p">
                    {secondShot?.resource?.lotNumber}
                </Typography>
                <Typography sx={{ fontSize: 14 }}>
                    Taken By
                </Typography>
                <Typography variant="h7" component="p">
                    {secondShot?.resource?.performer.map(p => `${p.actor.display},`)}
                </Typography>
                <Typography sx={{ fontSize: 14 }}>
                    Status
                </Typography>
                <Typography variant="h7" component="p">
                    {secondShot?.resource?.status}
                </Typography>
            </CardContent>
            <div className='bar'/>
        </div>
    );
}

