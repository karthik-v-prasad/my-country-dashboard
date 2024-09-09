import { GetStaticPaths, GetStaticProps } from 'next';
import { fetchCountries } from '../../services/countryService';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Image from 'next/image';
import { Country } from '@/interfaces/Country';

interface CountryDetailProps {
    country: Country;
}

const CountryDetail: React.FC<CountryDetailProps> = ({ country }) => {
    const router = useRouter();

    if (router.isFallback) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <h1>{country.name.common}</h1>
            <Image src={country.flags.png} alt={country.name.common} width={320} height={190} />
            <p>Capital: {country.capital?.join(', ')}</p>
            <p>Population: {country.population.toLocaleString()}</p>
            <p>Region: {country.region}</p>
            <p>Timezones: {country.timezones.join(', ')}</p>
            <p>Currencies: {Object.values(country.currencies).map(currency => `${currency.name} (${currency.symbol})`).join(', ')}</p>
            <p>Languages: {Object.values(country.languages).join(', ')}</p>
            <Link href="/">
                <button type="button" className="btn">Back to Dashboard</button>
            </Link>
        </div>
    );
};

export const getStaticPaths: GetStaticPaths = async () => {
    const countries = await fetchCountries();
    const paths = countries.map((country: Country) => ({
        params: { name: country.name.common },
    }));

    return { paths, fallback: true };
};

export const getStaticProps: GetStaticProps = async (context) => {
    const { name } = context.params!;
    const countries = await fetchCountries();
    const country = countries.find((country: Country) => country.name.common === name);

    if (!country) {
        return { notFound: true };
    }

    return {
        props: {
            country,
        },
    };
};

export default CountryDetail;
