import React from 'react';
import { useAsync } from '../../utils/hooks';
import { useAuth } from '../../context/auth-context.jsx';
import CardLogin from '../../components/CardLogin.jsx';
import { useDebouncedValue } from '../../Hook/useDebouncedValue.jsx';
export default function Login() {
  const { isLoading, isError, error, run } = useAsync();
  const { login } = useAuth();

  async function handleSubmit(event) {
    event.preventDefault();
    const { email, password } = event.target.elements;
    // la function run a besoin d'une promise pour passer du mode deconecter au mode connecter
    await run(
      login({
        email: email.value,
        password: password.value
      })
    );
    // const [value, setValue] = useState('');
    // const debouncedSearchTerm = useDebouncedValue(value, 500);

    useEffect(() => {}, [debouncedSearchTerm]);
  }
  if (isLoading) {
    return (
      <>
        <div>ici le speaner</div>
      </>
    );
  }
  if (isError)
    return (
      <>
        {error}
        <div>error</div>
      </>
    );
  return (
    <div>
      <CardLogin handleSubmit={handleSubmit} customClass="lg:justify-end justify-center " />
    </div>
  );
}
