import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import CompanyForm from "../../components/CompanyInfo/formComponent";

describe("CompanyForm", () => {
  test("renders form fields and handles input changes", () => {
    render(<CompanyForm />);

    // Find form fields by label texts
    const companyNameField = screen.getByLabelText("会社名");
    const mailIdField = screen.getByLabelText("連絡先メールID");
    const addressField = screen.getByLabelText("住所");
    const userCountField = screen.getByLabelText("ユーザー数");
    const descriptionField = screen.getByLabelText("説明");

    // Test initial values
    expect(companyNameField).toHaveValue("");
    expect(mailIdField).toHaveValue("");
    expect(addressField).toHaveValue("");
    expect(userCountField).toHaveValue("");
    expect(descriptionField).toHaveValue("");

    // Simulate input changes
    fireEvent.change(companyNameField, {
      target: { value: "Example Company" },
    });
    fireEvent.change(mailIdField, { target: { value: "example@example.com" } });
    fireEvent.change(addressField, { target: { value: "123 Example St" } });
    fireEvent.change(userCountField, { target: { value: "100" } });
    fireEvent.change(descriptionField, {
      target: { value: "Example description" },
    });

    // Test updated values
    expect(companyNameField).toHaveValue("Example Company");
    expect(mailIdField).toHaveValue("example@example.com");
    expect(addressField).toHaveValue("123 Example St");
    expect(userCountField).toHaveValue("100");
    expect(descriptionField).toHaveValue("Example description");
  });
});
