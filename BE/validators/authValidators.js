import zod from "zod";


export const signupValidator = zod.object({
    phoneNo: zod.string()
      .min(1, "Phone number is required"),
    countryCode: zod.string().min(1, "Country code is required"),
    password: zod.string()
      .min(1, "Password is required")
      .min(6, "Password must be at least 6 characters long"), 
    inviteCode: zod.string().optional(),
  });


export const loginValidator = zod.object({
  phoneNo: zod.string().min(1,"Phone number is required"),
  password: zod.string().min(1,"Password is required"),
});
