import Head from 'next/head';
import CountryDashboard from '../components/CountryDashboard';
import 'bootstrap/dist/css/bootstrap.css'

const Home: React.FC = () => {
  return (
    <div>
      <Head>
        <title>Country Dashboard</title>
        <meta name="description" content="Interactive dashboard displaying country data" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <CountryDashboard />
      </main>
    </div>
  );
};

export default Home;
