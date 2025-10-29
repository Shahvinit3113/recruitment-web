interface ImportMetaEnv {
    readonly VITE_API_BASE_URL: string
    readonly VITE_API_TIMEOUT: string
    readonly VITE_ENABLE_API_LOGGING: string
    // add more env variables as needed
}

interface ImportMeta {
    readonly env: ImportMetaEnv
}