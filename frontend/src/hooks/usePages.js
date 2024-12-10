import { useState } from "react"

export const usePage = () => {
    const [pageName, setPageName] = useState('');

    return [pageName, setPageName]
}