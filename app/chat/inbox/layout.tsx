interface InboxLayoutProps {
  children: React.ReactNode;
}

const InboxLayout: React.FC<InboxLayoutProps> = ({ children }) => {
  return (
    <section className="bg-gray-300 min-h-screen w-full">{children}</section>
  );
};

export default InboxLayout;
