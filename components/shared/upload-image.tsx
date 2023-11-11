"use client";

import Image from "next/image";
import { useState } from "react";
import { useDropzone } from 'react-dropzone';
import { cva, type VariantProps } from "class-variance-authority"
import { CheckCircle } from "lucide-react";

import { cn } from "@/lib/utils"
import { useToast } from "@/components/ui/use-toast";

const uploadImageVariants = cva(
  "relative",
  {
    variants: {
      size: {
        md: "w-[108px] h-[80px]",
        lg: "w-[216px] h-[160px]",
      },
    },
    defaultVariants: {
      size: "md",
    },
  }
)

declare global {
  interface File {
    preview?: string;
    url?: string;
  }
}

const cloudinaryCloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME as string;
const cloudinaryUploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET as string;

interface UploadImageProps extends VariantProps<typeof uploadImageVariants> {
  title?: string;
  description?: string;
  multiple?: boolean;
  onChange: (urls: string[] | string) => void;
  initialFiles?: File[]
}

const UploadImage: React.FC<UploadImageProps> = ({
  title = 'Select files',
  description = 'Click browse through your machine',
  size,
  multiple,
  onChange,
  initialFiles = []
}) => {
  const [files, setFiles] = useState<File[]>(initialFiles);
  const [uploading, setUploading] = useState(false);
  const { toast } = useToast();

  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      'image/*': []
    },
    multiple,
    onDrop: async (acceptedFiles) => {
      setFiles(acceptedFiles.map(file => Object.assign(file, {
        preview: URL.createObjectURL(file)
      })));

      try {
        setUploading(true);
        const result = await Promise.all(acceptedFiles.map(file => handleImageUpload(file)));
        setFiles((currentFiles) => currentFiles.map((file, index) => Object.assign(file, {
          url: result[index]?.url
        })));
        if (multiple) {
          onChange(result.map(item => item.url));
        } else {
          onChange(result.map(item => item.url)[0]);
        }
        setUploading(false);
      } catch (error) {
        setUploading(false);
        toast({ variant: "destructive", description: "Something went wrong." });
      }
    }
  });

  const handleImageUpload = async (file: File) => {
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', cloudinaryUploadPreset);
      const resp = await fetch(`https://api.cloudinary.com/v1_1/${cloudinaryCloudName}/image/upload`, {
        method: 'POST',
        body: formData,
      });
      return await resp.json();
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  return (
    <div {...getRootProps()} className={cn(
      uploading && "animate-pulse pointer-events-none"
    )}>
      <div
        className="border border-dashed rounded-lg bg-secondary p-4 flex items-center cursor-pointer">
        {
          !files.length &&
          <>
            <div className={cn(uploadImageVariants({ size }))}>
              <Image
                src="/images/illustration-upload.svg"
                fill
                priority
                alt="upload ic" />
            </div>
            <div className="ml-4">
              <h5>{title}</h5>
              <div className="text-xs font-light text-muted-foreground mt-1">{description}</div>
            </div>
          </>
        }

        {
          files.length > 0 &&
          <div className="overflow-x-auto w-full flex scrollbar-none">
            {
              files.map((file, index) => <div key={index} className={cn(
                !multiple && "flex justify-center w-full relative"
              )}>
                <div className={cn(
                  uploadImageVariants({ size }),
                  "rounded-lg relative",
                  multiple && "mr-2 border border-dashed"
                )}>
                  <Image
                    src={file.url || file.preview || ""}
                    fill
                    alt={file?.name ?? ""}
                    className={cn(
                      "rounded-lg",
                      multiple && "p-2"
                    )} />
                  {
                    file.url &&
                    <div className="absolute top-0 right-0 text-primary">
                      <CheckCircle size={18} />
                    </div>
                  }
                </div>
              </div>)
            }
          </div>
        }
      </div>
      <input
        {...getInputProps()}
        className="hidden"
      />
    </div>
  )
}

export default UploadImage;
