import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { revalidatePath, revalidateTag } from "next/cache";
import { NextResponse } from "next/server";

export function successResponseJson<T>(props: {
  data: T,
  tags?: string[],
  pagination?: {},
  paths?: string[]
}) {
  props?.tags?.forEach(tag => {
    revalidateTag(tag);
  });

  props?.paths?.forEach(path => {
    revalidatePath(path);
  });

  return NextResponse.json({
    ...props,
    success: true
  });
};

export function errorResponseJson<T>(error: T) {
  const result = getPrismaErrorMessage(error);

  return NextResponse.json({
    error: result,
    success: false,
  },
    { status: 400 });
}

export function getPrismaErrorMessage<T>(error: T) {
  if (error instanceof PrismaClientKnownRequestError) {
    const target = error.meta?.target;

    switch (error.code) {
      case 'P2002':
        return {
          message: `${capitalizeFirstLetter(String(target))} is already taken`,
          path: target
        };

      default:
        return {
          message: 'Something went wrong.',
          path: target
        };
    };
  };

  return error;
};

export function capitalizeFirstLetter(value: string) {
  return value.charAt(0).toUpperCase() + value.slice(1);
}
