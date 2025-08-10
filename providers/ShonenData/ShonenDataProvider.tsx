import { JSX, useMemo, useState } from 'react'
import { ShonenDataContext } from './ShonenData.context'
import { ShonenDataProviderProps } from './ShonenData.types';

export default function ShonenDataProvider({
    children,
}: Readonly<ShonenDataProviderProps>): JSX.Element {

    const value = useMemo(
        () => ({}),
        []
    )

    return (
        <ShonenDataContext.Provider value={value}>
            {children}
        </ShonenDataContext.Provider>
    )
}
