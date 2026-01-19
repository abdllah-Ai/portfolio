// src/utils/contentLoader.js
// Utility to load content based on client ID from environment or URL

import baseSite from '../content/base/site.json';
import baseSkills from '../content/base/skills.json';
import baseTheme from '../content/base/theme.json';

/**
 * Get the client ID from environment variable or URL param
 * @returns {string} Client ID or 'default'
 */
export function getClientId() {
    // Check environment variable first (set in .env as VITE_CLIENT_ID)
    if (import.meta.env.VITE_CLIENT_ID) {
        return import.meta.env.VITE_CLIENT_ID;
    }

    // Check URL param (?client=xyz)
    if (typeof window !== 'undefined') {
        const params = new URLSearchParams(window.location.search);
        const clientParam = params.get('client');
        if (clientParam) return clientParam;
    }

    return 'default';
}

/**
 * Load content for the current client
 * Falls back to base content if client-specific content not found
 * @returns {Promise<{site: object, skills: array, theme: object, clientId: string}>}
 */
export async function loadContent() {
    const clientId = getClientId();

    let site = { ...baseSite };
    let skills = [...baseSkills];
    let theme = { ...baseTheme };

    // Try to load client-specific overrides
    if (clientId !== 'default') {
        try {
            const clientSite = await import(`../content/clients/${clientId}/site.json`);
            site = { ...baseSite, ...clientSite.default };
        } catch {
            console.log(`No client site.json found for ${clientId}, using base`);
        }

        try {
            const clientSkills = await import(`../content/clients/${clientId}/skills.json`);
            skills = clientSkills.default;
        } catch {
            console.log(`No client skills.json found for ${clientId}, using base`);
        }

        try {
            const clientTheme = await import(`../content/clients/${clientId}/theme.json`);
            theme = { ...baseTheme, ...clientTheme.default };
        } catch {
            console.log(`No client theme.json found for ${clientId}, using base`);
        }
    }

    return { site, skills, theme, clientId };
}

/**
 * Synchronously get base content (for initial render)
 * @returns {{site: object, skills: array, theme: object}}
 */
export function getBaseContent() {
    return {
        site: baseSite,
        skills: baseSkills,
        theme: baseTheme,
    };
}

export default {
    getClientId,
    loadContent,
    getBaseContent,
};
