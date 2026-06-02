interface ContentWrapperProps {
  children?: React.ReactNode;
}

export default function ContentWrapper({ children }: ContentWrapperProps) {
  return (
    <div className="content-wrapper">
      {children}
    </div>
  );
}
