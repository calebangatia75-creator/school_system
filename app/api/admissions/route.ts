import { NextResponse } from "next/server";
import { createAdmissionApplication, createLead } from "@/lib/portal-data";

type AdmissionBody = {
  submissionType?: "inquiry" | "application";
  parentName?: string;
  phone?: string;
  childClassInterested?: string;
  message?: string;
  relationshipToStudent?: string;
  alternatePhone?: string;
  email?: string;
  homeLocation?: string;
  studentName?: string;
  studentGender?: string;
  dateOfBirth?: string;
  birthCertificateNumber?: string;
  applyingGrade?: string;
  currentSchool?: string;
  lastCompletedGrade?: string;
  transferReason?: string;
  transportMode?: string;
  specialNeeds?: string;
  medicalInformation?: string;
  siblingInformation?: string;
  emergencyContactName?: string;
  emergencyContactPhone?: string;
  emergencyContactRelationship?: string;
  parentExpectation?: string;
};

export async function POST(request: Request) {
  const body = (await request.json()) as AdmissionBody;
  const submissionType = body.submissionType ?? "inquiry";

  if (submissionType === "application") {
    const requiredFields = [
      body.parentName,
      body.phone,
      body.relationshipToStudent,
      body.homeLocation,
      body.studentName,
      body.studentGender,
      body.dateOfBirth,
      body.applyingGrade,
      body.currentSchool,
      body.lastCompletedGrade,
      body.transferReason,
      body.transportMode,
      body.emergencyContactName,
      body.emergencyContactPhone,
      body.emergencyContactRelationship,
      body.parentExpectation
    ];

    if (requiredFields.some((field) => !field?.trim())) {
      return NextResponse.json(
        { error: "Complete all required admission fields before submitting." },
        { status: 400 }
      );
    }

    try {
      await createAdmissionApplication({
        parentName: body.parentName!.trim(),
        relationshipToStudent: body.relationshipToStudent!.trim(),
        phone: body.phone!.trim(),
        alternatePhone: body.alternatePhone?.trim(),
        email: body.email?.trim(),
        homeLocation: body.homeLocation!.trim(),
        studentName: body.studentName!.trim(),
        studentGender: body.studentGender!.trim(),
        dateOfBirth: body.dateOfBirth!.trim(),
        birthCertificateNumber: body.birthCertificateNumber?.trim(),
        applyingGrade: body.applyingGrade!.trim(),
        currentSchool: body.currentSchool!.trim(),
        lastCompletedGrade: body.lastCompletedGrade!.trim(),
        transferReason: body.transferReason!.trim(),
        transportMode: body.transportMode!.trim(),
        specialNeeds: body.specialNeeds?.trim(),
        medicalInformation: body.medicalInformation?.trim(),
        siblingInformation: body.siblingInformation?.trim(),
        emergencyContactName: body.emergencyContactName!.trim(),
        emergencyContactPhone: body.emergencyContactPhone!.trim(),
        emergencyContactRelationship: body.emergencyContactRelationship!.trim(),
        parentExpectation: body.parentExpectation!.trim()
      });

      return NextResponse.json({
        message: "Application submitted to the Headteacher and Deputy Headteacher."
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Unable to submit application.";
      return NextResponse.json({ error: errorMessage }, { status: 400 });
    }
  }

  const parentName = body.parentName?.trim() ?? "";
  const phone = body.phone?.trim() ?? "";
  const childClassInterested = body.childClassInterested?.trim() ?? "";
  const message = body.message?.trim() ?? "";

  if (!parentName || !phone || !childClassInterested || !message) {
    return NextResponse.json(
      { error: "Fill in parent name, phone number, class interested, and message." },
      { status: 400 }
    );
  }

  try {
    await createLead({ parentName, phone, childClassInterested, message });
    return NextResponse.json({
      message: "Admission inquiry received. The school team can now see it in the portal."
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unable to save inquiry.";
    return NextResponse.json({ error: errorMessage }, { status: 400 });
  }
}
