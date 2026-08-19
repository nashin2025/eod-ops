export default function PendingApprovalPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-yellow-50 to-orange-50">
      <div className="text-center p-8">
        <h1 className="text-2xl font-bold mb-4">Account Pending Approval</h1>
        <p className="text-gray-600 mb-6">
          Your account has been registered but is awaiting admin approval. You will be notified once approved.
        </p>
        <div className="flex flex-col gap-4">
          <a href="tel:+0009947180" className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700">
            Call Admin
          </a>
          <a
            href="/api/auth/logout"
            className="bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700"
          >
            Logout
          </a>
        </div>
      </div>
    </div>
  );
}
