interface SettingsLayoutProps {
  children: React.ReactNode;
}

const SettingsLayout: React.FC<SettingsLayoutProps> = ({ children }) => {
  return (
    <section className="bg-gray-300 min-h-screen w-full">{children}</section>
  );
};

export default SettingsLayout;
