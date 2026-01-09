import { SignupForm } from '@/components/signup-form'
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { Fragment } from 'react/jsx-runtime'

export default async function page() {

    return (
        <Fragment>
            <SignupForm />
        </Fragment>
    )
}
