export default function AuthLayout({ title, children }) {
  return (
    <div className="container d-flex justify-content-center align-items-center vh-100">
      <div className="card shadow" style={{ width: "400px" }}>
        <div className="card-body">
          <h4 className="text-center mb-3">{title}</h4>
          {children}  
        </div>
      </div>
    </div>
  );
}
