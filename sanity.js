import { createCurrentUserHook, createClient } from 'next-sanity';
import createImageUrlBuilder from '@sanity/image-url';

export const config = {
	dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
	projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
	apiVersion: '2022-06-20',
	useCdn: process.env.NODE_ENV === 'production'
};

// Setup the client for fetching data in the getProps page functions
export const sanityClient = createClient(config);

// Setup a helper function for generating Image URL's with only the asset reference data in your documents.
export const urlFor = source => createImageUrlBuilder(config).image(source);
