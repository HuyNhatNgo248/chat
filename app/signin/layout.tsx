interface SigninLayoutProps {
  children: React.ReactNode;
}

const SigninLayout: React.FC<SigninLayoutProps> = ({ children }) => {
  return (
    <main className="min-h-screen flex justify-center items-center px-4">
      {children}
    </main>
  );
};

export default SigninLayout;
