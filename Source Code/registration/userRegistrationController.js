(function () {
    /**
     * Created by tmoore on 4/4/16.
     * Cleaned random garbage characters such as " " from this file - vlad, 5/29/2016
     */

    angular
        .module('userRegistrationController', ['userService', 'toDoModule', 'vip-projects'])
        .controller('registrationController', function (User, ToDoService, ProfileService, LocationService, DateTimeService, adminService) {
            var vm = this;

            vm.adminEmail;
            adminService.getAdminSettings().then(function (data)
            {
                var adminData;
                adminData = data;
                console.log(adminData);
                console.log(adminData.current_email);
                vm.adminEmail = adminData.current_email;
            });

            vm.Users = [
                {
                    name: 'Staff/Faculty',
                    ranks: [
                        'Instructor',
                        'Assitant Professor',
                        'Associate Professor',
                        'Full Professor',
                        'Administrator',
                        'Director'
                    ]
                },
                {
                    name: 'Pi/CoPi',
                    ranks: [
                        'PI',
                        'CoPI',
                        'Coordinator',
                        'External Member'
                    ]
                },
                {
                    name: 'Student',
                    ranks: [
                        'Freshman',
                        'Sophmore',
                        'Junior',
                        'Senior',
                        'Masters',
                        'PhD',
                        'postDoc'
                    ]
                }

            ];

            vm.Colleges = [
                {
                    name: 'Architecture + The Arts ',
                    schools: [
                        'Architecture',
                        'Interior Architecture',
                        'Landscape Architecture and Environmental Urban Design',
                        'Art and Art History',
                        'Communication Arts',
                        'School of Music',
                        'Theatre']
                },
                {
                    name: 'Arts and Sciences & Education',
                    schools: [
                        'Biological Sciences',
                        'Chemistry and Biochemistry',
                        'Earth and Environment',
                        'English',
                        'Mathematics and Statistics',
                        'Philosophy',
                        'Physics',
                        'Psychology',
                        'Teaching and Learning',
                        'Leadership and Professional Studies',
                        'School of Education',
                        'School of Enviroment, Arts & Society',
                        'School of Integrated Science & Humanity'

                    ]
                },
                {
                    name: 'Business',
                    schools: [
                        'Decision Sciences and Information Systems',
                        'Alvah H. Chapman Jr. Graduate School of Business',
                        'R. Kirk Landon Undergraduate School of Business',
                        'Finance',
                        'Management and International Business',
                        'Marketing',
                        'School of Accounting',
                        'Real Estate'
                    ]
                },
                {
                    name: 'Chaplin School of Hospitality and Tourism Management',
                    schools: [
                        'Hospitality and Tourism Management'
                    ]
                },
                {
                    name: 'Engineering & Computing',
                    schools: [
                        'School of Computing and Information Sciences',
                        'OHL School of Construction',
                        'Department of Biomedical Engineering',
                        'Department of Civil and Environment Engineering',
                        'Department of Electrical and Computer Engineering',
                        'Department of Mechanical and Materials Engineering'
                    ]
                },
                {
                    name: 'Herbert Wertheim College of Medicine',
                    schools: [
                        'Cellular Biology and Pharmacology',
                        'Human and Molecular Genetics',
                        'Immunology',
                        'Medical and Population Health Sciences Research'
                    ]
                },
                //User Story 1175
                {
                    name: 'Honors College',
                    schools: []
                },
                {
                    name: 'Journalism and Mass Communication',
                    schools: [
                        'Advertising and Public Relations',
                        'Journalism Broadcasting and Digital Media'
                    ]
                },
                {
                    name: 'Law',
                    schools: [
                        'College of Law'
                    ]
                },
                {
                    name: 'Nicole Wertheim College of Nursing & Health Sciences',
                    schools: [
                        'Biostatistics',
                        'Dietetics and Nutrition',
                        'Environmental and Occupational Health',
                        'Epidemiology',
                        'Health Policy and Management',
                        'Health Promotion and Disease Prevention'
                    ]

                },
                {
                    name: 'Robert Stempel College of Public Health & Social Work',
                    schools: [
                        'School of Social Work'
                    ]
                },
                {
                    name: 'Steven J. Green School of International and Public Affairs',
                    schools: [
                        'Criminal Justice',
                        'Economics',
                        'Global and Sociocultural Studies',
                        'History',
                        'Modern Languages',
                        'Public Administration',
                        'Religious Studies'
                    ]
                }
            ];
            vm.userType = vm.Users[1];
            vm.college = vm.Colleges[1];

            vm.onchange = function (value) {
                if (value === "Student") {
                    alert("A student does need to register.You may simply login with your .fiu.edu account.");
                }
            }

            vm.saveUser = function () {
                vm.processing = true;
                // initialize both message to be returned by API and object ID to be used in verification
                vm.message = '';
                vm.objectId = '';
                //userstory 1209
                vm.userData.RegDate = DateTimeService.getCurrentDateTimeAsString();


                if (vm.userData == undefined) {
                    alert("Please fill out all fields.");
                    return;
                }


                //START OF FORM INPUT VALIDATION FUNCTIONS //
                if (!first_validation(vm.userData.firstName)) {
                    return; // no first name.. go back to form
                }

                if (!last_validation(vm.userData.lastName)) {
                    return; // no last name.. go back to form
                }

                // check for email
                if (vm.userData.email == undefined) {
                    alert("Please enter an email address.")
                    return;
                }

                if (vm.userData.userType == undefined) {
                    alert("Please select User Type");
                    return false;
                }


                // convert email to lower case
                var inputEmail = vm.userData.email;
                vm.userData.email = inputEmail.toLowerCase();
                // User Story #1175
                var collegename = vm.userData.college.name;
                // call email validation function
                if (!email_validation(vm.userData.email, vm.userData.userType.name)) {
                    return; // invalid email.. go back to form
                }

                // validate password
                if (!pass_validation(vm.userData.password, vm.userData.passwordConf)) {
                    return; // password validation failed.. return to form
                }

                // validate User Type
                if (!userType_validation(vm.userData.userType.name)) {
                    return;// return to form.. block a student from registering
                }

                if (!rank_validation(vm.userData.rank)) {
                    return;// return to form..did not enter rank
                }

                if (!pid_validation(vm.userData.pantherID, vm.userData.userType.name)) {
                    return; // invalid panther id, return to form
                }

                if (!gender_validation(vm.userData.gender)) {
                    return; // go back to from
                }

                if(!Linkedin_validation(vm.userData.Linkedin))
                {
                    return;
                }

                if (vm.userData.college == undefined) {
                    alert("Please select your College.");
                    return false;
                }

                // User Story #1175
                if (vm.userData.department == undefined) {
                    if (collegename != "Honors College") {
                        alert("Please select your Department.");
                        return false;

                    }
                }
                //END OF FORM INPUT VALIDATION FUNCTIONS //

                //alert("Seems all validation checks passed");


                // solution for now to set user type.. might change when data comes from DB
                //vm.userData.userType = vm.userData.userType.name;
                //vm.userData.userType = mongoose.Types.ObjectId("vlad_test");
                vm.userData.userType = vm.userData.userType.name;

                // solution for now to set college.. might change when data comes from DB
                vm.userData.college = vm.userData.college.name;

                // call user service which makes the post from userRoutes
                User.create(vm.userData).success(function (data) {
                    //console.log("Result of adding new account (should check for dupes):");
                    vm.processing = false;

                    // only insert user if return value of user.save in userRoutes.js returns success
                    if (data.success) {
                        success_msg();

                        // Here we have the user ID so we can send an email to user
                        vm.objectId = data.objectId;

                        vm.userData.recipient = vm.userData.email;
                        vm.userData.text = "Welcome to FIU's VIP Project!" +
                            " Please verify your email with the link below and standby for your account to be verified by the PI.<br/><br/>" + LocationService.vipApiUrls.vip.verifyEmail + "/" + vm.objectId + "";
                        vm.userData.subject = "Welcome to FIU VIP Project!";

                        // send email to PI for approval
                        vm.userData.recipient2 = vm.adminEmail;

                        // User Story #1140
                        vm.userData.text2 = vm.userData.firstName + " " + vm.userData.lastName + " is attempting to register, please accept or reject using the following link:<br/><br/> " + LocationService.vipWebUrls.verifyUser;
                        vm.userData.subject2 = vm.userData.firstName + " " + vm.userData.lastName + " is attempting to Register a New Account";

                        User.nodeEmail(vm.userData);

                        //Create todo for PI validation.

                        // User Story #1140
                        var todo = {
                            owner: "Pi/CoPi",
                            todo: vm.userData.firstName + " has registered an account. Please CoPI validate his account.",
                            type: "user",
                            link: LocationService.vipWebUrls.verifyUser
                        };

                        ToDoService.createTodo(todo).then(function (success) {

                        }, function (error) {

                        });

                        //Create todo for then newly registered user.

                        var todo2 = {
                            owner: vm.userData.userType,
                            owner_id: vm.objectId + "",
                            todo: "Welcome to VIP " + vm.userData.firstName + ", as a faculty you will be able to propose projects that students can join. Please check this page for importatnt notificcations.",
                            type: "personal",
                            link: "/#/to-do"
                        };

                        ToDoService.createTodo(todo2).then(function (success) {

                        }, function (error) {

                        });

                    }

                    // user already exists in the database, or some other error occured in user.save function
                    else {
                        error_msg();
                    }
                })
            };

            //validation
            function email_validation(uemail, userType) {

                // check for length 0
                var uemail_len = uemail.length;
                if (uemail_len == 0) {
                    alert("Email should not be empty.");
                    return false;
                }
                return true;
            }

//Makes sure first name is only letters
            function first_validation(first) {
                if (first == undefined) {
                    alert("First name should not be empty.")
                    return false;
                }
                var first_len = first.length;
                if (first_len == 0) {
                    alert("First Name should not be empty.");
                    return false;
                }
                var letters = /^[A-Za-z]+$/;
                if (first.match(letters)) {
                    return true;
                } else {
                    alert('First name must contain alphabet characters only.')
                    return false;
                }
                return true;
            }

//Makes sure last name is only letters
            function last_validation(last) {
                if (last == undefined) {
                    alert("Last name should not be empty.")
                    return false;
                }
                var last_len = last.length;
                if (last_len == 0) {
                    alert("Last Name should not be empty.");
                    return false;
                }
                var letters = /^[A-Za-z]+$/;
                if (last.match(letters)) {
                    return true;
                } else {
                    alert('Last name must contain alphabet characters only.');
                    return false;
                }
                return true;
            }

//Makes sure panther ID is only numbers and of correct length
//NEED TO FIX PID BEING ENTERED AS A LETTER
            function pid_validation(pid, userType) {

                if (userType == "Pi/CoPi") {
                    return true;
                }

                if (pid == undefined) {
                    alert("Panther ID should not be empty.")
                    return false;
                }
                var numbers = /[0-9]/;
                if (pid.match(numbers)) {
                } else {
                    alert('PID must have numeric characters only');
                    return false;
                }
                var pid_len = pid.length;
                if (pid_len != 7) {
                    alert("Please enter your 7 digit Panther-ID.");
                    return false;
                }
                return true;
            }

//Confirms that both passwords entered are correct.
            function pass_validation(pass, passconf) {

                var message = "The password must have atleast 8 chars with one uppercase letter, one lower case letter, one digit and one of !@#$%&amp;*()";


                if (pass == undefined || passconf == undefined) {
                    alert("Please fill in both password fields.")
                    return false;
                }
                var pass_len = pass.length;
                if (pass_len == 0) {
                    alert("Please fill in the Password field.");
                    return false;
                }

                if (pass != passconf) {
                    alert("Passwords do not match.");
                    return false;
                }

                // check for string password
                if (!isStrongPwd(pass)) {

                    alert(message);

                    return false;
                }


                return true;
            }

// function to cehck for a strong password .. will be called in passconf
            function isStrongPwd(password) {

                var uppercase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

                var lowercase = "abcdefghijklmnopqrstuvwxyz";

                var digits = "0123456789";

                var splChars = "!@#$%&*()";

                var ucaseFlag = contains(password, uppercase);

                var lcaseFlag = contains(password, lowercase);

                var digitsFlag = contains(password, digits);

                var splCharsFlag = contains(password, splChars);

                if (password.length >= 8 && ucaseFlag && lcaseFlag && digitsFlag && splCharsFlag)
                    return true;
                else
                    return false;

            }

// checks the is trong password function
            function contains(password, allowedChars) {

                for (i = 0; i < password.length; i++) {

                    var char = password.charAt(i);

                    if (allowedChars.indexOf(char) >= 0) {
                        return true;
                    }

                }

                return false;
            }

//Verifies the user selected a user Type
            function userType_validation(userType) {

                if (userType == "Student") {
                    alert("A student does need to register.You may simply login with your .fiu.edu account.")
                    return false;
                }

                return true;
            }
            function Linkedin_validation(url) 
                {   if(!url)
                    {
                        var r=confirm("Are you sure you don't want to add your Linkedin URL?");
                        if (r==true)
                            {
                            return true;
                            }
                        if (r==false)
                            {
                                return;
                            }
                       
                    }
                    var pattern = /^((https?:\/\/)?((www|\w\w)\.)?linkedin\.com\/)((([\w]{2,3})?)|([^\/]+\/(([\w|\d-&#?=])+\/?){1,}))$/;
                    if (pattern.test(url))
                    {
                        //alert("Linkedin Url is valid");
                        return true;
                    } 
                        alert("Linkedin Url is not valid!");
                        return false;
                }

            function rank_validation(rank) {

                if (rank == undefined) {
                    alert("Rank should not be empty.")
                    return false;
                }
                if (rank == "Default") {
                    alert("Rank is a required field.")
                    return false;
                }

                return true;
            }

            function gender_validation(gender) {
                //Sex is no longer required for registration
                return true;
                if (gender == undefined) {
                    alert("Gender should not be empty.")
                    return false;
                }
                if (gender != "Male" || gender != "Female") {
                    alert("Please select a Gender.")
                    return false;
                }

                return true;
            }

            function success_msg() {
                swal({
                        title: "Account Created!",
                        text: "Thanks for joining VIP! Please approve your account through your email.",
                        type: "success",
                        confirmButtonText: "Will do!",
                        allowOutsideClick: true,
                        timer: 9000,
                    }, function () {
                        window.location = LocationService.vipWebUrls.home;
                    }
                );
            }

            function error_msg() {
                swal({
                        title: "You are already a user",
                        text: "This email is already in our system. Please try logging in or resetting your password.",
                        type: "error",
                        confirmButtonText: "I will try that!",
                        allowOutsideClick: true,
                        timer: 9000,
                    }
                );
            }
        });


}());