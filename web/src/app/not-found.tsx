import { buttonVariants } from '@/components/ui/button';
import { paths } from '@/config/paths';
import Link from 'next/link';

const NotFound = () => {
  return (
    <main className='flex h-screen items-center justify-center w-full'>
      <section className='space-y-4 text-center'>
        <h1 className='font-semibold'>Halaman yang kamu cari gak ditemukan</h1>
        <p className='text-5xl md:text-7xl font-mono'>404</p>
        <Link href={paths.app.index} className={buttonVariants({ variant: 'default' })}>
          Kembali ke beranda
        </Link>
      </section>
    </main>
  );
};

export default NotFound;
