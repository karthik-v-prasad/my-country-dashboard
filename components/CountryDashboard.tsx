import React, { useEffect, useState } from 'react';
import Link from 'next/link'
import Image from 'next/image';
import { fetchCountries } from '../services/countryService';
import { useInView } from 'react-intersection-observer';
import { Country } from '@/interfaces/Country';
import {Card, CardBody, CardFooter} from "@nextui-org/card";
import 'bootstrap/dist/css/bootstrap.css'

const CountryDashboard: React.FC = () => {
    const [countries, setCountries] = useState<Country[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
    const [region, setRegion] = useState<string>('all');
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [page, setPage] = useState<number>(1);
    const [ref, inView] = useInView();

    useEffect(() => {
        const getCountries = async () => {
            try {
                const data = await fetchCountries();
                setCountries(data);
            } catch (e) {
              if (e instanceof Error) {
                setError(e.message);
              }
              else {
                setError("Failed to get countries data");
              }                
            } finally {
                setLoading(false);
            }
        };
        getCountries();
    }, []);

    useEffect(() => {
        if (inView && !loading) {
            setPage((prevPage) => prevPage + 1);
        }
    }, [inView, loading]);

    const sortCountries = (order: 'asc' | 'desc') => {
        const sortedCountries = [...countries].sort((a, b) => {
            if (order === 'asc') {
                return a.population - b.population;
            } else {
                return b.population - a.population;
            }
        });
        setCountries(sortedCountries);
        setSortOrder(order);
    };

    const filterCountriesByRegion = (region: string) => {
        setRegion(region);
    };

    const handleSearch = (query: string) => {
        setSearchQuery(query.toLowerCase());
    };

    const filteredCountries = countries
        .filter(country => region === 'all' || country.region === region)
        .filter(country => 
            country.name.common.toLowerCase().includes(searchQuery) || 
            (country.capital && country.capital.some(cap => cap.toLowerCase().includes(searchQuery)))
        );

    const countriesToShow = filteredCountries.slice(0, page * 20);

    if (loading) {
        return <p>Loading...</p>;
    }

    if (error) {
        return <p>Error: {error}</p>;
    }
    

    return (
        <div className="gap-2 grid grid-cols-2 sm:grid-cols-4">
            <h1>Country Dashboard</h1>
            <div>
                <label htmlFor="region">Filter by Region: </label>
                <select id="region" onChange={(e) => filterCountriesByRegion(e.target.value)}>
                    <option value="all">All</option>
                    <option value="Africa">Africa</option>
                    <option value="Americas">Americas</option>
                    <option value="Asia">Asia</option>
                    <option value="Europe">Europe</option>
                    <option value="Oceania">Oceania</option>
                </select>
            </div>            
            <div>
                <label htmlFor="search">Search by Name or Capital: </label>
                <input 
                    type="text" 
                    id="search" 
                    value={searchQuery} 
                    onChange={(e) => handleSearch(e.target.value)} 
                />
            </div>
            <div className="btn-group" role="group" aria-label="Sort by population">
                <button type="button" className="btn btn-outline-primary" onClick={() => sortCountries('asc')}>Sort by Population (Ascending)</button>
                <button type="button" className="btn btn-outline-primary" onClick={() => sortCountries('desc')}>Sort by Population (Descending)</button>
            </div>
            <div className="card-group" style={{ display: 'flex', flexWrap: 'wrap' }}>
                {countriesToShow.map((country,index) => (
                    <div className="card" key={index}>
                        <div key={country.name.common}>
                            <Link href={`/country/${country.name.common}`}>
                                <Image src={country.flags.png} alt={country.name.common} width={320} height={190}/>                                
                            </Link>
                        </div>
                        <div className="card-body"> 
                            <h2 className="card-title">{country.name.common}</h2>
                            <div className="card-text">
                                <p>Population: {country.population.toLocaleString()}</p>
                                <p>Region: {country.region}</p>
                                <p>Capital: {country.capital?.join(', ')}</p>
                            </div>                     
                        </div>
                            
                    </div>
                ))}
            </div>
            <div ref={ref} style={{ height: '20px' }}></div>
        </div>
    );
};

export default CountryDashboard;
