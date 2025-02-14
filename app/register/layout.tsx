interface RegisterLayoutProps {
  children: React.ReactNode;
}

const RegisterLayout: React.FC<RegisterLayoutProps> = ({ children }) => {
  return (
    <main className="flex justify-center items-center min-h-screen px-4">
      {children}
    </main>
  );
};

export default RegisterLayout;
