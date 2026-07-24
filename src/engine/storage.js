const STORAGE_KEY = 'birthday-vault-scene'

export const storage = {
    save(sceneName) {
        try {
            localStorage.setItem(STORAGE_KEY, sceneName)
        } catch (error) {
            console.warn('[Storage] save failed', error)
        }
    },

    load() {
        try {
            return localStorage.getItem(STORAGE_KEY)
        } catch (error) {
            console.warn('[Storage] load failed', error)
            return null
        }
    },
}
