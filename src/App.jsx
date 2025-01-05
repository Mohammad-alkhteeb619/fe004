import { BrowserRouter, Routes, Route } from "react-router-dom";
import NavBar from "./Components/GeneralBlock/Navbar"; // Import your NavBar component
import Home from "./Components/GeneralBlock/Home";
import CreateD from "./Components/Doctor/Create"; // Your AddDoctor component
import CardD from "./Components/Doctor/Card";
import DetailsD from "./Components/Doctor/Details";
import UpdateD from "./Components/Doctor/Update";

import CreateN from "./Components/Nurse/Create"; // Your AddNurse component
import CardN from "./Components/Nurse/Card";
import DetailsN from "./Components/Nurse/Details";
import UpdateN from "./Components/Nurse/Update";

import CreateM from "./Components/Management/Create"; // Your AddNurse component
import CardM from "./Components/Management/Card";
import DetailsM from "./Components/Management/Details";
import UpdateM from "./Components/Management/Update";

import CreatePH from "./Components/Pharmacist/Create"; // Your AddNurse component
import CardPH from "./Components/Pharmacist/Card";
import DetailsPH from "./Components/Pharmacist/Details";
import UpdatePH from "./Components/Pharmacist/Update";

import Patient from "./Components/Patient/PatientTable";
import Addpatient from "./Components/Patient/AddPatient";

import Createpres from "./Components/Patient/WritePrescription";
import GetPres from "./Components/Patient/Prescription";
import All from "./Components/Patient/AllPrescription";
import Issue from "./Components/Patient/WritePrescription"
import WriteVitalSigns from "./Components/Patient/WriteVitalSigns";
import VitalSignHistory from "./Components/Patient/vitalSignsHistory";

import WriteDiagnosis from "./Components/Patient/WriteDiagnose";
import DiagnosisCard from "./Components/Patient/GetDiagnose";
import DiagnosisCards from "./Components/Patient/AllDiagnosis";

import WriteSickLeave from "./Components/Patient/ExcuseAbsence";
import SickLeaves from "./Components/Patient/AllSickLeave";
import SickLeave from "./Components/Patient/SickLeave";
import IssueVitalSigns from "./Components/Patient/WriteVitalSigns";
import OrderDrug from "./Components/GeneralBlock/OrderDrug";
import Drug from "./Components/GeneralBlock/Drug";
import DrugsReceiver from "./Components/GeneralBlock/DrugsReceiver";
import Get from "./Components/Patient/Prescription"
import Login from "./Components/GeneralBlock/Login";
import ProtectedRoute from "./Components/GeneralBlock/Test";
import "./styles/mycss.css"
import { useTransition } from "react";
function App() {

  return (
    <BrowserRouter>
      <NavBar />

      <Routes>
        <Route path="/login" element={<Login />} />

        <Route
          path="/create-vital-signs/:id"
          element={
            <ProtectedRoute
              userRole={[
                "Admin",
                "Nurse"
                
              ]}
            >
              <IssueVitalSigns />
            </ProtectedRoute>
          }
        />

        <Route
          path="/create-prescription/:id"
          element={
            <ProtectedRoute
              userRole={[
                "Admin",
                "Doctor"
                
              ]}
            >
              <Issue />
            </ProtectedRoute>
          }
        />

        <Route
          path="/"
          element={
            <ProtectedRoute
              userRole={[
                "Admin",
                "ManagementStaff",
                "Doctor",
                "Pharmacist",
                "Nurse",
              ]}
            >
              <Home />
            </ProtectedRoute>
          }
        />

        <Route
          path="/order-drug"
          element={
            <ProtectedRoute userRole={["Admin", "Pharmacist"]}>
              <OrderDrug />
            </ProtectedRoute>
          }
        />
        <Route
          path="/drugs"
          element={
            <ProtectedRoute userRole={["Admin", "ManagementStaff"]}>
              <Drug />
            </ProtectedRoute>
          }
        />
        <Route
          path="/drug-orders"
          element={
            <ProtectedRoute userRole={["Admin", "ManagementStaff"]}>
              <DrugsReceiver />
            </ProtectedRoute>
          }
        />

        <Route
          path="/create-sick-leave/:id"
          element={
            <ProtectedRoute userRole={["Admin", "ManagementStaff", "Doctor"]}>
              <WriteSickLeave />
            </ProtectedRoute>
          }
        />
        <Route
          path="/sick-leave/:id"
          element={
            <ProtectedRoute userRole={["Admin", "ManagementStaff", "Doctor"]}>
              <SickLeave />
            </ProtectedRoute>
          }
        />
        <Route
          path="/all-sick-leaves/:id"
          element={
            <ProtectedRoute userRole={["Admin", "ManagementStaff", "Doctor"]}>
              <SickLeaves />
            </ProtectedRoute>
          }
        />
        <Route
          path="/create-diagnosis/:id"
          element={
            <ProtectedRoute userRole={["Admin", "Doctor"]}>
              <WriteDiagnosis />
            </ProtectedRoute>
          }
        />


<Route
          path="/prescription/:id"
          element={
            <ProtectedRoute
              userRole={[
                "Admin",
                "ManagementStaff",
                "Doctor",
                "Pharmacist",
                "Nurse",
              ]}
            >
              <Get />
            </ProtectedRoute>
          }
        />

        <Route
          path="/diagnosis/:id"
          element={
            <ProtectedRoute
              userRole={[
                "Admin",
                "ManagementStaff",
                "Doctor",
                "Pharmacist",
                "Nurse",
              ]}
            >
              <DiagnosisCard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/all-diagnosis/:id"
          element={
            <ProtectedRoute
              userRole={[
                "Admin",
                "ManagementStaff",
                "Doctor",
                "Pharmacist",
                "Nurse",
              ]}
            >
              <DiagnosisCards />
            </ProtectedRoute>
          }
        />

        <Route
          path="/all-prescription/:id"
          element={
            <ProtectedRoute
              userRole={["Admin", "Doctor", "Pharmacist", "Nurse"]}
            >
              <All />
            </ProtectedRoute>
          }
        />
        <Route
          path="/prescription/:id"
          element={
            <ProtectedRoute
              userRole={["Admin", "Doctor", "Pharmacist", "Nurse"]}
            >
              <GetPres />
            </ProtectedRoute>
          }
        />
        <Route
          path="/create-prescription/:id"
          element={
            <ProtectedRoute userRole={["Doctor"]}>
              <Createpres />
            </ProtectedRoute>
          }
        />

        <Route
          path="/create-vital-signs/:id"
          element={
            <ProtectedRoute userRole={["Nurse"]}>
              <WriteVitalSigns />
            </ProtectedRoute>
          }
        />
        <Route
          path="/history-vital-signs/:id"
          element={
            <ProtectedRoute
              userRole={["Admin", "Doctor", "Pharmacist", "Nurse"]}
            >
              <VitalSignHistory />
            </ProtectedRoute>
          }
        />

        <Route
          path="/update-doctor/:id"
          element={
            <ProtectedRoute userRole={["Admin"]}>
              <UpdateD />
            </ProtectedRoute>
          }
        />
        <Route
          path="/create-doctor"
          element={
            <ProtectedRoute userRole={["Admin"]}>
              <CreateD />
            </ProtectedRoute>
          }
        />
        <Route
          path="/doctors"
          element={
            <ProtectedRoute userRole={["Admin", "ManagementStaff"]}>
              <CardD />
            </ProtectedRoute>
          }
        />
        <Route
          path="/details-doctor/:id"
          element={
            <ProtectedRoute userRole={["Admin", "ManagementStaff"]}>
              <DetailsD />
            </ProtectedRoute>
          }
        />

        <Route
          path="/update-nurse/:id"
          element={
            <ProtectedRoute userRole={["Admin"]}>
              <UpdateN />
            </ProtectedRoute>
          }
        />
        <Route
          path="/create-nurse"
          element={
            <ProtectedRoute userRole={["Admin"]}>
              <CreateN />
            </ProtectedRoute>
          }
        />
        <Route
          path="/nurses"
          element={
            <ProtectedRoute userRole={["Admin", "ManagementStaff"]}>
              <CardN />
            </ProtectedRoute>
          }
        />
        <Route
          path="/details-nurse/:id"
          element={
            <ProtectedRoute userRole={["Admin", "ManagementStaff"]}>
              <DetailsN />
            </ProtectedRoute>
          }
        />

        <Route
          path="/update-staff/:id"
          element={
            <ProtectedRoute userRole={["Admin"]}>
              {" "}
              <UpdateM />{" "}
            </ProtectedRoute>
          }
        />
        <Route
          path="/create-staff"
          element={
            <ProtectedRoute userRole={["Admin"]}>
              {" "}
              <CreateM />{" "}
            </ProtectedRoute>
          }
        />
        <Route
          path="/staff"
          element={
            <ProtectedRoute userRole={["Admin", "ManagementStaff"]}>
              {" "}
              <CardM />{" "}
            </ProtectedRoute>
          }
        />
        <Route
          path="/details-staff/:id"
          element={
            <ProtectedRoute userRole={["Admin", "ManagementStaff"]}>
              {" "}
              <DetailsM />{" "}
            </ProtectedRoute>
          }
        />

    
        <Route
          path="/update-pharmacist/:id"
          element={
            <ProtectedRoute userRole={["Admin"]}>
              <UpdatePH />
            </ProtectedRoute>
          }
        />
        <Route
          path="/create-pharmacist"
          element={
            <ProtectedRoute userRole={["Admin"]}>
              <CreatePH />
            </ProtectedRoute>
          }
        />
        <Route
          path="/pharmacists"
          element={
            <ProtectedRoute userRole={["Admin", "ManagementStaff"]}>
              <CardPH />
            </ProtectedRoute>
          }
        />
        <Route
          path="/details-pharmacist/:id"
          element={
            <ProtectedRoute userRole={["Admin", "ManagementStaff"]}>
              <DetailsPH />
            </ProtectedRoute>
          }
        />

        <Route
          path="/patients"
          element={
            <ProtectedRoute
              userRole={[
                "Admin",
                "Doctor",
                "Pharmacist",
                "Nurse",
                "ManagementStaff",
              ]}
            >
              <Patient />
            </ProtectedRoute>
          }
        />

        <Route
          path="/create-patient"
          element={
            <ProtectedRoute userRole={["Admin", "ManagementStaff"]}>
              <Addpatient />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
