import React from 'react';
import '../../app/globals.css';
const colors = {
    Primary : [
  { name: 'Primary 10', variable: '--color-primary-10', hex: '#f6fcff' },
  { name: 'Primary 20', variable: '--color-primary-20', hex: '#e3faff' },
  { name: 'Primary 30', variable: '--color-primary-30', hex: '#67e6ff' },
  { name: 'Primary 40', variable: '--color-primary-40', hex: '#38deff' },
  { name: 'Primary 50', variable: '--color-primary-50', hex: '#3ac8ff' },
  { name: 'Primary 60', variable: '--color-primary-60', hex: '#21a8f1' },
  { name: 'Primary 70', variable: '--color-primary-70', hex: '#278cff' },
  { name: 'Primary 80', variable: '--color-primary-80', hex: '#177bec' },
    ],
    Orange : [
  { name: 'Orange 10', variable: '--color-sub-orange-10', hex: '#fff6f0' },
  { name: 'Orange 20', variable: '--color-sub-orange-20', hex: '#fccfb1' },
  { name: 'Orange 30', variable: '--color-sub-orange-30', hex: '#ffb380' },
  { name: 'Orange 40', variable: '--color-sub-orange-40', hex: '#ffa970' },
  { name: 'Orange 50', variable: '--color-sub-orange-50', hex: '#ff893a' },
    ],
    Grey : [
  { name: 'Grey 10', variable: '--color-grey-10', hex: '#f6f9fb' },
  { name: 'Grey 20', variable: '--color-grey-20', hex: '#e7edf3' },
  { name: 'Grey 30', variable: '--color-grey-30', hex: '#d4dee5' },
  { name: 'Grey 40', variable: '--color-grey-40', hex: '#c2ccd7' },
  { name: 'Grey 50', variable: '--color-grey-50', hex: '#afbbc6' },
  { name: 'Grey 60', variable: '--color-grey-60', hex: '#9aa3af' },
  { name: 'Grey 70', variable: '--color-grey-70', hex: '#74808e' },
  { name: 'Grey 80', variable: '--color-grey-80', hex: '#4a5361' },
  { name: 'Grey 85', variable: '--color-grey-85', hex: '#333c4a' },
  { name: 'Grey 90', variable: '--color-grey-90', hex: '#171d29' },
    ],
};


export default {
  title: 'FOUNDATIONS/Color',
};

export const ColorPalette = () => (
  <div style={{ display: 'flex', gap : '2rem' }}>
    {Object.entries(colors).map(([groupName, groupColors]) => (
        <div key={groupName}>
            <h3 style={{marginBottom : '0.5rem'}}>{groupName}</h3>
            <div style={{display : 'flex', flexDirection : 'column', gap: '0.5rem'}}>
                {groupColors.map((color) => (
                    <div
                        key={color.variable}
                        style={{
                            width : '160px',
                            height : '70px',
                            backgroundColor: `var(${color.variable})`,
                            borderRadius : '6px',
                            boxShadow : '0 1px 3px rgba(0, 0, 0, 0.1)',
                            padding : '0.5rem',
                            display : 'flex',
                            flexDirection : 'column',
                            justifyContent : 'center',
                            fontSize : '0.75rem',
                            color : '#000',
                            border : '1px solid #ddd',
                        }}
                    >
                        <div style={{fontWeight : 'bold'}}>{color.name}</div>
                        <div>{color.variable}</div>
                        <div>{color.hex}</div>
                    </div>
                ))}
            </div>
        </div>
    ))}
    </div>
);
   
