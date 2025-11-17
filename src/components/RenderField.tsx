import { TextField } from "@mui/material";

interface FormFieldProps<FormType> {
    title: string;
    value: string | number | null | undefined;
    field: keyof FormType;
    type?: string;
    onChange: (field: keyof FormType, value: string) => void;
}

export default function FormField<FormType>({
    title,
    value,
    field,
    type = "text",
    onChange
}: FormFieldProps<FormType>) {
    return (
        <TextField
            fullWidth
            label={title}
            value={value ?? ""}
            type={type}
            onChange={(e) => onChange(field, e.target.value)}
            size="small"
            sx={{ mb: 1 }}
        />
    );
}
