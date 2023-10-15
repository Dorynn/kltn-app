import Department from "../components/pages/Department/Department";
import GraduationThesisInfo from "../components/pages/GraduationThesis/Student/GraduationThesisInfo/GraduationThesisInfo";
import GraduationThesisSubmit from "../components/pages/GraduationThesis/Student/GraduationThesisSubmit/GraduationThesisSubmit";
import ViewGrades from "../components/pages/GraduationThesis/Student/ViewGrades/ViewGrades";
import GraduationThesisManager from "../components/pages/GraduationThesis/Teacher/GraduationThesisManager/GraduationThesisManager";
import ReviewReportGraduation from "../components/pages/GraduationThesis/Teacher/ReviewReportGraduation/ReviewReportGraduation";
import Login from "../components/pages/Login/Login";
import Major from "../components/pages/Major/Major";
import Subject from "../components/pages/Subject/Subject";
import TopicRegistrationProposed from "../components/pages/TopicManagement/Student/TopicRegistrationProposed/TopicRegistrationProposed";
import ApprovedTopicList from "../components/pages/TopicManagement/Teacher/ApprovedTopicList/ApprovedTopicList";
import ProposedTopicList from "../components/pages/TopicManagement/Teacher/ProposedTopicList/ProposedTopicList";
import TopicList from "../components/pages/TopicManagement/Teacher/TopicList/TopicList";
import TopicRegistration from "../components/pages/TopicManagement/Teacher/TopicRegistration/TopicRegistration";
import ChargePerson from "../components/pages/User/ChargePerson/ChargePerson";
import Lecturer from "../components/pages/User/Lecturer/Lecturer";
import Student from "../components/pages/User/Student/Student";
import ThesisGrade from "../components/pages/GraduationThesis/Student/ThesisGrade/ThesisGrade";
import AchievedRecord from "../components/pages/ThesisDefenseManagement/AchievedRecord/AchievedRecord";
import DefenseEstablish from "../components/pages/ThesisDefenseManagement/DefenseEstablish/DefenseEstablish";
import GradeManagement from "../components/pages/ThesisDefenseManagement/GradeManagement/GradeManagement";
import GraduationThesesStudentInfo from "../components/pages/ThesisDefenseManagement/GraduationThesesStudentInfo/GraduationThesesStudentInfo";
import ResultUpdate from "../components/pages/ThesisDefenseManagement/ResultUpdate/ResultUpdate";
import ReviewerTeacherAssignment from "../components/pages/ThesisDefenseManagement/ReviewerTeacherAssignment/ReviewerTeacherAssignment";

// URL
import { 
    URL_APPROVED_TOPIC_LIST,
    URL_DEPARTMENT, 
    URL_GRADUATE_CHARGE_PERSON, 
    URL_GRADUATION_THESIS_INFO, 
    URL_GRADUATION_THESIS_MANAGER, 
    URL_GRADUATION_THESIS_SUBMIT, 
    URL_LECTURER, 
    URL_LOGIN, 
    URL_MAJOR, 
    URL_PROPOSED_TOPIC_LIST, 
    URL_REVIEW_REPORT_GRADUATION, 
    URL_STUDENT,
    URL_STUDENT_TOPIC_REGISTRATION,
    URL_SUBJECT,
    URL_TEACHER_TOPIC_REGISTRATION,
    URL_TOPIC_LIST,
    URL_ACHIEVED_RECORD,
    URL_GRADE_MANAGEMENT,
    URL_RESULT_UPDATE,
    URL_GRADUATION_THESES_STUDENT_INFO,
    URL_DEFENSE_ESTABLISH,
    URL_REVIEWER_TEACHER_ASSIGNMENT,
    URL_THESIS_GRADE,
    URL_VIEW_GRADES,
} from "./configUrl";

export const routes = [
    // quản lý khoa
    { 
        path: URL_DEPARTMENT, 
        element: <Department /> 
    },
    // quản lý ngành
    { 
        path: URL_MAJOR, 
        element: <Major /> 
    },
    // quản lý người phụ trách
    { 
        path: URL_GRADUATE_CHARGE_PERSON, 
        element: <ChargePerson /> 
    },
    // quản lý học phần
    { 
        path: URL_SUBJECT, 
        element: <Subject /> 
    },
    { 
        path: URL_LOGIN, 
        element: <Login /> 
    },
    // quản lý giáo viên
    { 
        path: URL_LECTURER, 
        element: <Lecturer /> 
    },
    // quản lý học sinh
    { 
        path: URL_STUDENT, 
        element: <Student /> 
    },
    // đăng ký đề tài
    { 
        path: URL_TEACHER_TOPIC_REGISTRATION, 
        element: <TopicRegistration /> 
    },
    // danh sách đề tài
    { 
        path: URL_TOPIC_LIST, 
        element: <TopicList /> 
    },
    // duyệt đề tài đăng ký
    { 
        path: URL_APPROVED_TOPIC_LIST, 
        element: <ApprovedTopicList /> 
    },
    // duyệt đề tài đề xuất
    { 
        path: URL_PROPOSED_TOPIC_LIST, 
        element: <ProposedTopicList /> 
    },
    { 
        path: URL_STUDENT_TOPIC_REGISTRATION, 
        element: <TopicRegistrationProposed /> 
    },
    // thông tin khóa luận
    { 
        path: URL_GRADUATION_THESIS_INFO, 
        element: <GraduationThesisInfo /> 
    },
    // nộp tài liệu
    { 
        path: URL_GRADUATION_THESIS_SUBMIT, 
        element: <GraduationThesisSubmit /> 
    },
    // Xem điểm
    { 
        path: URL_VIEW_GRADES, 
        element: <ViewGrades /> 
    },
    // quản lý khóa luận
    { 
        path: URL_GRADUATION_THESIS_MANAGER, 
        element: <GraduationThesisManager /> 
    },
    // Xét duyệt báo cáo
    { 
        path: URL_REVIEW_REPORT_GRADUATION, 
        element: <ReviewReportGraduation /> 
    },
    // Xem điểm
    {
        path: URL_THESIS_GRADE,
        element: <ThesisGrade/>
    },
    // Lưu trữ hồ sơ
    {
        path: URL_ACHIEVED_RECORD,
        element: <AchievedRecord/>
    },
    // Quản lý điểm
    {
        path: URL_GRADE_MANAGEMENT,
        element: <GradeManagement/>
    },
    // Cập nhật kết quả
    {
        path: URL_RESULT_UPDATE,
        element: <ResultUpdate/>
    },
    // Danh sách bảo vệ KLTN
    {
        path: URL_GRADUATION_THESES_STUDENT_INFO,
        element: <GraduationThesesStudentInfo/>
    },
    // Thành lập hội đồng bảo vệ KLTN
    {
        path: URL_DEFENSE_ESTABLISH,
        element: <DefenseEstablish/>
    },
    // Phân công giáo viên phụ trách
    {
        path: URL_REVIEWER_TEACHER_ASSIGNMENT,
        element: <ReviewerTeacherAssignment/>
    }
];