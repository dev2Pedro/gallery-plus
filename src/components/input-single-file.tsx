import { type VariantProps, tv } from "tailwind-variants";
import Icon from "./icon";
import Text, { textVariants } from "./text";
import UploadFileIcon from "../assets/icons/upload-file.svg?react";
import FileImageIcon from "../assets/icons/image.svg?react";
import { useWatch } from "react-hook-form";
import React from "react";

export const InputSingleFileVariants = tv({
  base: `
        flex flex-col items-center justify-center w-full
        border border-solid border-border-primary
        group-hover:border-border-active
        rounded-lg gap-1 transition
    `,
  variants: {
    size: {
      md: "px-5 py-6",
    },
  },
  defaultVariants: {
    size: "md",
  },
});

export const inputSingleFileIconVariants = tv({
  base: "fill-placeholder",
  variants: {
    size: {
      md: "w-8 h-8",
    },
  },
  defaultVariants: {
    size: "md",
  },
});

interface InputSingleFileProps
  extends VariantProps<typeof InputSingleFileVariants>,
    Omit<React.ComponentProps<"input">, "size"> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  form: any;
  allowedExtensions: string[];
  maxFileSizeInMB: number;
  error?: React.ReactNode;
}

export default function InputSingleFile({
  form,
  size,
  error,
  allowedExtensions,
  maxFileSizeInMB,
  ...props
}: InputSingleFileProps) {
  const formValues = useWatch({ control: form.control });
  const name = props.name || "";

  const formFile: File | undefined = React.useMemo(() => {
    const value = formValues[name];
    if (!value) return undefined;
    return Array.isArray(value) ? value[0] : value;
  }, [formValues, name]);

  const { fileExtension, fileSize } = React.useMemo(() => {
    if (!formFile) return { fileExtension: "", fileSize: 0 };
    return {
      fileExtension: formFile.name.split(".").pop()?.toLowerCase() || "",
      fileSize: formFile.size,
    };
  }, [formFile]);

  function isValidExtension() {
    return allowedExtensions.includes(fileExtension);
  }

  function isValidSize() {
    return fileSize <= maxFileSizeInMB * 1024 * 1024;
  }

  function isValidFile() {
    return isValidExtension() && isValidSize();
  }

  return (
    <div>
      {!formFile || !isValidFile ? (
        <>
          <div className="w-full relative group cursor-pointer">
            <input
              type="file"
              name={name}
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (!file) return;

                const ext = file.name.split(".").pop()?.toLowerCase();
                const size = file.size;

                if (!allowedExtensions.includes(ext || "")) {
                  form.setValue(name, undefined);
                  alert("Tipo de arquivo inválido");
                  return;
                }

                if (size > maxFileSizeInMB * 1024 * 1024) {
                  form.setValue(name, undefined);
                  alert(`Arquivo maior que ${maxFileSizeInMB}MB`);
                  return;
                }

                form.setValue(name, [file], { shouldValidate: true });
              }}
              className="
    absolute top-0 right-0 w-full h-full
    opacity-0 cursor-pointer
  "
            />

            <div className={InputSingleFileVariants({ size })}>
              <Icon
                svg={UploadFileIcon}
                className={inputSingleFileIconVariants({ size })}
              />
              <Text
                variant="label-medium"
                className="text-placeholder text-center"
              >
                Arraste o arquivo aqui
                <br />
                ou clique para selecionar
              </Text>
            </div>
          </div>

          <div className="flex flex-col gap-1 mt-1">
            {formFile && !isValidExtension() && (
              <Text variant="label-small" className="text-accent-red">
                Tipo de arquivo inválido
              </Text>
            )}
            {formFile && !isValidSize() && (
              <Text variant="label-small" className="text-accent-red">
                O tamanho do arquivo excede o limite de {maxFileSizeInMB}MB
              </Text>
            )}
            {error && (
              <Text variant="label-small" className="text-accent-red">
                {error}
              </Text>
            )}
          </div>
        </>
      ) : (
        <div className="flex gap-3 items-center border border-solid border-border-primary mt-5 p-3 rounded">
          <Icon svg={FileImageIcon} className="fill-white w-6 h-6" />
          <div className="flex flex-col">
            <div className="truncade max-w-80">
              <Text variant="label-medium" className="text-placeholder">
                {formFile.name}
              </Text>

              <div className="flex">
                <button
                  type="button"
                  className={textVariants({
                    variant: "label-small",
                    className: "text-accent-red cursor-pointer hover:underline",
                  })}
                  onClick={() => {
                    form.setValue(name, undefined);
                  }}
                >
                  Remover
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
