import { Suspense } from 'react';
import Reports from '../components/reports/Reports';

const page = () => {



  return (
    <div>
      <Suspense fallback={<div className='h-screen flex justify-center items-center'>Loading...</div>}>
        <Reports />
      </Suspense>
    </div>
  );
};

export default page;