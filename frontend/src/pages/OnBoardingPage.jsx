import { useState } from "react";
import useAuthUser from "../hooks/useAuthUser";
import { useQueryClient } from "@tanstack/react-query";
import { completeOnboarding } from "../lib/api";
import { useMutation } from "@tanstack/react-query";
import { CameraIcon, LoaderIcon, ShipWheelIcon } from "lucide-react";
import { ShuffleIcon } from "lucide-react";
import { LANGUAGES } from "../constants";
import { MapPinIcon } from "lucide-react";
import { toast } from "react-hot-toast";

const OnBoardingPage = () => {
	const { authUser } = useAuthUser();
	const queryClient = useQueryClient();

	const [formState, setFormState] = useState({
		fullName: authUser?.fullName || "",
		bio: authUser?.bio || "",
		nativeLanguage: authUser?.nativeLanguage || "",
		learningLanguage: authUser?.learningLanguage || "",
		location: authUser?.location || "",
		profilePic: authUser?.profilePic || "",
	});

	const { mutate: onboardingMutation, isPending } = useMutation({
		mutationFn: completeOnboarding,
		onSuccess: () => {
			toast.success("Profile onboarded successfully");
			queryClient.invalidateQueries({ queryKey: ["authUser"] });
		},
    onError : (error)=>{
        toast.error(error.response.data.message);
    }
	});

	const handleSubmit = (e) => {
		e.preventDefault();
		onboardingMutation(formState);
	};

	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormState({
			...formState,
			[name]: value,
		});
	};

	const handleRandomAvatar = () => {
		const idx = Math.floor(Math.random() * 100) + 1;
		const randomAvatar = `https://avatar.iran.liara.run/public/${idx}`;
		setFormState({ ...formState, profilePic: randomAvatar });
		toast.success("Random profile picture generated!");
	};

	return (
		<div className='min-h-screen bg-base-100 flex items-center justify-center p-4'>
            {/* Card padding changed to p-4 sm:p-6 */}
			<div className='card bg-base-200 w-full max-w-3xl shadow-xl'>
				<div className='card-body p-4 sm:p-6'> 
					<h1 className='text-2xl sm:text-3xl font-bold text-center mb-4'>Complete Your Profile</h1>

                    {/* Form spacing changed to space-y-4 */}
					<form onSubmit={handleSubmit} className='space-y-4'>
						{/*PROFILE PIC CONTAINER */}
						<div className='flex flex-col items-center justify-center space-y-3'>
							{/*IMAGE PREVIEW */}
							<div className='size-28 rounded-full bg-base-300 overflow-hidden'>
								{formState.profilePic ? (
									<img src={formState.profilePic} alt='Profile preview' className='w-full h-full object-cover' />
								) : (
									<div className='flex items-center justify-center h-full'>
										<CameraIcon className='size-12 text-base-content opacity-40' />
									</div>
								)}
							</div>

							{/*Generate random avatar btn */}
							<div className='flex items-center gap-2'>
								<button type='button' onClick={handleRandomAvatar} className='btn btn-accent btn-sm'>
									<ShuffleIcon className='size-4 mr-1' />
									Generate Random Avatar
								</button>
							</div>
						</div>
						{/*FULL NAME*/}
						<div className='form-control'>
							<label className='label py-1'>
								<span className='label-text'>Full Name</span>
							</label>
							<input
								type='text'
								name='fullName'
								value={formState.fullName}
								onChange={handleChange}
								className='input input-bordered w-full'
								placeholder='Your full Name'
							/>
						</div>

						{/*BIO*/}
						<div className='form-control'>
							<label className='label py-1'>
								<span className='label-text'>Bio</span>
							</label>
							<textarea
								name='bio'
								value={formState.bio}
								onChange={handleChange}
								className='textarea textarea-bordered h-20'
								placeholder="Tell others about yourself..."
							/>
						</div>

						{/* --- START LANGUAGE GRID --- */}
						<div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
							{/*NATIVE LANGUAGE*/}
							<div className='form-control'>
								<label className='label py-1'>
									<span className='label-text'>Native Language</span>
								</label>
								<select
									name='nativeLanguage'
									value={formState.nativeLanguage}
									onChange={handleChange}
									className='select select-bordered w-full'
								>
									<option value=''>Select native language</option>
									{LANGUAGES.map((lang) => (
										<option key={`native-${lang}`} value={lang.toLowerCase()}>
											{lang}
										</option>
									))}
								</select>
							</div>

							{/*LEARNING LANGUAGE*/}
							<div className='form-control'>
								<label className='label py-1'>
									<span className='label-text'>Learning Language</span>
								</label>
								<select
									name='learningLanguage'
									value={formState.learningLanguage}
									onChange={handleChange}
									className='select select-bordered w-full'
								>
									<option value=''>Select language to learn</option>
									{LANGUAGES.map((lang) => (
										<option key={`learning-${lang}`} value={lang.toLowerCase()}>
											{lang}
										</option>
									))}
								</select>
							</div>
						</div>
						{/* --- END LANGUAGE GRID --- */}

						{/*LOCATION*/}
						<div className='form-control'>
							<label className='label py-1'>
								<span className='label-text'>Location</span>
							</label>
							<div className='relative'>
								<MapPinIcon className='absolute top-1/2 transform -translate-y-1/2 left-2 size-5 text-base-content opacity-70' />
								<input
									type='text'
									name='location'
									value={formState.location}
									onChange={handleChange}
									className='input input-bordered w-full pl-10'
									placeholder='City, Country'
								/>
							</div>
						</div>

						{/*SUBMIT BUTTON*/}
						<button className='btn btn-primary w-full mt-6' disabled={isPending} type='submit'>
							{!isPending ? (
								<>
									<ShipWheelIcon className='size-5 mr-2' />
									Complete OnBoarding
								</>
							) : (
								<>
									<LoaderIcon className='animate-spin size-5 mr-2' />
									OnBoarding...
								</>
							)}
						</button>
					</form>
				</div>
			</div>
		</div>
	);
};

export default OnBoardingPage;