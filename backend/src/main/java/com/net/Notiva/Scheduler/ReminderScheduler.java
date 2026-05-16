package com.net.Notiva.Scheduler;

import com.net.Notiva.entity.Reminder;
import com.net.Notiva.repository.ReminderRepository;
import com.net.Notiva.services.RemindernotificationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.List;

@Component
public class ReminderScheduler {

    @Autowired
    private ReminderRepository reminderRepository;

    @Autowired
    private RemindernotificationService reminderNotificationService;

    @Scheduled(fixedRate = 60000)

    public void checkReminders() {
        List<Reminder> reminder =
                reminderRepository.
                        findByReminderTimeBeforeAndNotifiedFalse
                                (LocalDateTime.now());

        for (Reminder reminder1 : reminder) {
            reminderNotificationService.
                    triggerReminder(reminder1);
//            reminderRepository.save(reminder1);
        }
    }
}
