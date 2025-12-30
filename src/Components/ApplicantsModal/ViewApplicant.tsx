import { Title } from "../Title";

export interface Applicant {
  id: number;
  applicant_name: string;
  applicant_contact: string;
  applied_date: string;
  job: string;
  status: "pending" | "approved" | "rejected";
}

type ViewApplicantProps = {
  setModal: () => void;
  applicant: Applicant | null;
};

export const ViewApplicant = ({ setModal, applicant }: ViewApplicantProps) => {
  return (
    <div className="fixed inset-0 bg-opacity-50 backdrop-blur-xs flex items-center justify-center z-10">
      <div className="w-full flex justify-center">
        <div className="bg-white w-full max-w-3xl border border-indigo-500 rounded-lg p-6 shadow-lg">
          <Title setModal={setModal}>Applicant Detail</Title>

          <div className="mt-6 space-y-4">
            <div className="flex justify-between border-b pb-2">
              <span className="text-lg font-semibold text-gray-800">
                Applicant Name:
              </span>
              <p className="text-gray-600">
                {applicant?.applicant_name}
              </p>
            </div>

            <div className="flex justify-between border-b pb-2">
              <span className="text-lg font-semibold text-gray-800">
                Contact:
              </span>
              <p className="text-gray-600">
                {applicant?.applicant_contact}
              </p>
            </div>

            <div className="flex justify-between border-b pb-2">
              <span className="text-lg font-semibold text-gray-800">
                Applied Date:
              </span>
              <p className="text-gray-600">
                {applicant?.applied_date?.slice(0, 10)}
              </p>
            </div>

            <div className="flex justify-between border-b pb-2">
              <span className="text-lg font-semibold text-gray-800">
                Job Title:
              </span>
              <p className="text-gray-600">
                {applicant?.job}
              </p>
            </div>

            <div className="flex justify-between border-b pb-2">
              <span className="text-lg font-semibold text-gray-800">
                Status:
              </span>
              <span
                className={`px-3 py-1 rounded-full text-sm font-semibold
                  ${
                    applicant?.status === "pending" &&
                    "bg-orange-100 text-orange-600"
                  }
                  ${
                    applicant?.status === "approved" &&
                    "bg-green-100 text-green-600"
                  }
                  ${
                    applicant?.status === "rejected" &&
                    "bg-red-100 text-red-600"
                  }`}
              >
                {applicant?.status}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
