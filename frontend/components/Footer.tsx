import * as React from 'react';
import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';

export default function Footer() {
  return (
    <footer className="mt-auto border-black border-t-2 border-t-stone-700 place-items-center p-4">
      <div className="order-1 mt-0">
        <Typography variant="body2" sx={{color: "whitesmoke"}} align="center" className=''>
          &copy;
          <Link color="inherit" href="https://github.com/bobeu">
            Generic Finance
          </Link>{' '}
          {new Date().getFullYear()}
          {'.'}
        </Typography>
      </div>
    </footer>
  );
}
