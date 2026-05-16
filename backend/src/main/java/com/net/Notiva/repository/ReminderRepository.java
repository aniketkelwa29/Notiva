package com.net.Notiva.repository;


import com.net.Notiva.entity.Reminder;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

public interface ReminderRepository extends MongoRepository<Reminder,String> {

List<Reminder>findByReminderTimeBeforeAndNotifiedFalse (LocalDateTime time);
}
