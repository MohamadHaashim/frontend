import { ApolloClient, InMemoryCache } from '@apollo/client';


let dynamicMediaUrl = '';
const fetchConfig = async() => {
    try {
        const response = await fetch(`${process.env.PUBLIC_URL}/json/configJson.json?t=${new Date().getTime()};`);
        const config = await response.json();
        const domainName = config.find((page) => page.name === 'Tech configuration');
        if (domainName) {
            dynamicMediaUrl = domainName.configurations[1].fields[7].default;
        }
        return config;
    } catch (error) {
        console.error('Error fetching config:', error);
        return null;
    }
};
// Fetch the configuration
await fetchConfig();

let token = localStorage.getItem('authToken')
export const GRAPHQL_URI = 'https://stg-oss-api-v2.movingwalls.com/graphql/';
export const MAPBOX_TOKEN = 'pk.eyJ1IjoidGVqYS1zaHJlZSIsImEiOiJjbHo4OWF6ZHgwMGwxMmxzYWxzaTk1YnNiIn0.hpbbzYRq7WOaOPwInekf9w';
export const REACT_APP_PLATFORM_BASE_URL = `https://${dynamicMediaUrl}`;
export const MEDIA_URL = dynamicMediaUrl;

const client = new ApolloClient({
    uri: GRAPHQL_URI,
    headers: {
        authorization: `Bearer ${token}`,
    },
    cache: new InMemoryCache()
});

export { dynamicMediaUrl };
export default client;